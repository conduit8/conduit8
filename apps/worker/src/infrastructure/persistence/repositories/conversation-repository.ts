import type { UUIDv4 } from '@kollektiv/core';

import { and, eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';

import type { PlatformContext } from '@worker/domain/models/index.ts';
import type { IConversationRepository } from '@worker/domain/repositories/index.ts';
import type { ConversationInsert, ConversationSelect } from '@worker/infrastructure/persistence/database/schema/conversations';

import { Conversation } from '@worker/domain/models/index.ts';
import { StorageError } from '@worker/infrastructure/errors/infrastructure.errors.ts';
import { conversations } from '@worker/infrastructure/persistence/database/schema/conversations';

import { CachedRepositoryBase } from './cached-repository-base.ts';

/**
 * Repository for Conversation persistence
 * Extends CfCacheRepository for dual storage (KV cache + D1 persistence)
 *
 * Storage strategy:
 * - Conversation entities: KV (cache) + D1 (persistent)
 * - Session history: R2 (blob storage)
 */
export class ConversationRepository
  extends CachedRepositoryBase<Conversation>
  implements IConversationRepository {
  private readonly db;
  private readonly r2: R2Bucket;

  constructor(
    kv: KVNamespace,
    d1: D1Database,
    r2: R2Bucket,
  ) {
    super(kv, d1);
    this.db = drizzle(d1);
    this.r2 = r2;
  }

  /**
   * Factory method to create repository from Env
   */
  static create(env: Env): ConversationRepository {
    return new ConversationRepository(env.KV, env.D1, env.R2);
  }

  // ========== Primary Domain Operations ==========

  /**
   * Find existing conversation or create a new one
   * Convenience method that combines find and create operations
   */
  async findOrCreate(
    userId: string,
    context: PlatformContext,
  ): Promise<Conversation> {
    // Try to find existing conversation
    const existing = await this.findByUserAndContext(userId, context);
    if (existing) {
      console.log('Found existing conversation', {
        conversationId: existing.id,
        userId,
        hasSession: !!existing.claudeSessionId,
      });
      return existing;
    }

    // Create new conversation
    const conversation = Conversation.startNew(userId, context);
    await this.save(conversation);

    console.log('Created new conversation', {
      conversationId: conversation.id,
      userId,
      platform: context.platform,
    });

    return conversation;
  }

  async findByUserAndContext(
    userId: string,
    context: PlatformContext,
  ): Promise<Conversation | null> {
    // Build the full KV key using our platform-specific method
    const lookupKey = this.generateLookupKey(userId, context);
    const kvKey = this.buildKvKey(lookupKey);

    // Use the new findWithCache with flexible query
    return this.findWithCache(
      kvKey,
      async (uid: string, ctx: PlatformContext) => {
        try {
          // Query using Drizzle with proper JSON extraction
          const result = await this.db
            .select()
            .from(conversations)
            .where(
              and(
                eq(conversations.platformUserId, uid),
                sql`json_extract(${conversations.platformContext}, '$.threadTs') = ${ctx.threadTs}`,
              ),
            )
            .get();

          return result ? this.toDomain(result) : null;
        }
        catch (error) {
          console.error('Failed to query conversation from D1', {
            userId: uid,
            platform: ctx.platform,
            threadTs: ctx.threadTs,
            error: error instanceof Error ? error.message : String(error),
          });
          throw new StorageError(
            'Failed to find conversation in database',
            'read',
            undefined,
            error instanceof Error ? error : new Error(String(error)),
          );
        }
      },
      86400, // 24 hour TTL for conversations
      userId,
      context,
    );
  }

  async save(conversation: Conversation): Promise<void> {
    // TODO: [CRITICAL - OPTIMISTIC LOCKING] Implement version check in D1 update
    // - Add WHERE clause: `WHERE id = ? AND version = ?` (conversation.version - 1)
    // - Check result.changes === 0 to detect concurrent modification
    // - Throw ConcurrencyError if version mismatch
    // This works with the version field TODO in Conversation entity

    // Build the full KV key from conversation data
    const lookupKey = this.generateLookupKey(
      conversation.platformUserId,
      conversation.platformContext,
    );
    const kvKey = this.buildKvKey(lookupKey);

    try {
      // Use the new save method with TTL
      await super.save(conversation, kvKey, 86400); // 24 hour TTL

      console.log('Conversation saved successfully', {
        conversationId: conversation.id,
        userId: conversation.platformUserId,
        platform: conversation.platformContext.platform,
        hasSession: !!conversation.claudeSessionId,
      });
    }
    catch (error) {
      console.error('Failed to save conversation', {
        conversationId: conversation.id,
        userId: conversation.platformUserId,
        error: error instanceof Error ? error.message : String(error),
      });
      // Re-throw with proper context
      throw new StorageError(
        `Failed to save conversation ${conversation.id}`,
        'write',
        undefined,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }

  async deleteConversation(conversation: Conversation): Promise<void> {
    // Build the full KV key from conversation object
    const lookupKey = this.generateLookupKey(
      conversation.platformUserId,
      conversation.platformContext,
    );
    const kvKey = this.buildKvKey(lookupKey);

    try {
      // Call the base class delete with both key and entity
      // We're wrapping the base class method to maintain our interface
      await super.delete(kvKey, conversation);

      console.log('Conversation deleted successfully', {
        conversationId: conversation.id,
        userId: conversation.platformUserId,
        platform: conversation.platformContext.platform,
      });
    }
    catch (error) {
      console.error('Failed to delete conversation', {
        conversationId: conversation.id,
        userId: conversation.platformUserId,
        error: error instanceof Error ? error.message : String(error),
      });
      // Re-throw with proper context
      throw new StorageError(
        `Failed to delete conversation ${conversation.id}`,
        'delete',
        undefined,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }

  // ========== Session History Operations (R2) ==========

  async getSessionHistory(
    userId: string,
    sessionId: string,
  ): Promise<{ data: ArrayBuffer; projectId: string } | null> {
    try {
      // Build R2 key using internal helper
      const r2Key = this.generateHistoryPath(userId, sessionId);

      const object = await this.r2.get(r2Key);
      if (!object) {
        console.log('Session not found in R2', { userId, sessionId, r2Key });
        return null;
      }

      const projectId = object.customMetadata?.projectId;
      if (!projectId) {
        console.error('Session found but missing projectId metadata', { userId, sessionId });
        return null;
      }

      const data = await object.arrayBuffer();

      return { data, projectId };
    }
    catch (error) {
      console.error('Failed to get session history', {
        userId,
        sessionId,
        error: String(error),
      });
      throw new Error(`Failed to get session history: ${error}`);
    }
  }

  async saveSessionHistory(
    userId: string,
    sessionId: string,
    data: ArrayBuffer,
    projectId: string,
  ): Promise<void> {
    try {
      // Build R2 key using internal helper
      const r2Key = this.generateHistoryPath(userId, sessionId);

      await this.r2.put(r2Key, data, {
        customMetadata: {
          userId,
          sessionId,
          projectId,
        },
      });
    }
    catch (error) {
      console.error('Failed to save session history', {
        userId,
        sessionId,
        error: String(error),
      });
      throw new Error(`Failed to save session history: ${error}`);
    }
  }

  async deleteSessionHistory(
    userId: string,
    sessionId: string,
  ): Promise<void> {
    try {
      const r2Key = this.generateHistoryPath(userId, sessionId);
      await this.r2.delete(r2Key);

      console.log('Session deleted from R2', {
        userId,
        sessionId,
        r2Key,
      });
    }
    catch (error) {
      console.error('Failed to delete session history', {
        userId,
        sessionId,
        error: String(error),
      });
      throw new Error(`Failed to delete session history: ${error}`);
    }
  }

  // ========== Mapper Methods (Private Implementation Details) ==========

  /**
   * Maps domain aggregate to database row structure
   */
  private toPersistence(conversation: Conversation): ConversationInsert {
    return {
      id: conversation.id,
      platformUserId: conversation.platformUserId,
      platformContext: JSON.stringify(conversation.platformContext),
      claudeSessionId: conversation.claudeSessionId ?? null,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }

  /**
   * Reconstructs domain aggregate from database row
   */
  private toDomain(dbRow: ConversationSelect): Conversation {
    return new Conversation(
      dbRow.id as UUIDv4,
      dbRow.platformUserId,
      JSON.parse(dbRow.platformContext) as PlatformContext,
      dbRow.claudeSessionId ?? undefined,
      dbRow.createdAt,
      dbRow.updatedAt,
    );
  }

  // ========== CachedRepositoryBase Abstract Implementation ==========

  protected async serialize(conversation: Conversation): Promise<string> {
    // Convert domain → DB structure → JSON string for KV storage
    const dbRow = this.toPersistence(conversation);
    // JSON.stringify automatically converts Date to ISO string
    return JSON.stringify(dbRow);
  }

  protected async deserialize(data: string): Promise<Conversation> {
    // Parse JSON and reconstruct dates
    const parsed = JSON.parse(data);
    // Convert ISO strings back to Date objects for domain model
    const dbRow: ConversationSelect = {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
      updatedAt: new Date(parsed.updatedAt),
    };
    return this.toDomain(dbRow);
  }

  protected async saveToD1(conversation: Conversation): Promise<void> {
    const dbRow = this.toPersistence(conversation);

    await this.db
      .insert(conversations)
      .values(dbRow)
      .onConflictDoUpdate({
        target: conversations.id,
        set: {
          claudeSessionId: dbRow.claudeSessionId,
          updatedAt: dbRow.updatedAt,
        },
      })
      .run();
  }

  protected async deleteFromD1(conversation: Conversation): Promise<void> {
    // Delete by ID using Drizzle - clean, no string parsing!
    await this.db
      .delete(conversations)
      .where(eq(conversations.id, conversation.id))
      .run();
  }

  // ========== Helper Methods ==========

  /**
   * Generate platform-specific lookup key for KV storage
   * This is an infrastructure concern, not domain logic
   */
  private generateLookupKey(userId: string, context: PlatformContext): string {
    switch (context.platform) {
      case 'slack':
        return `${context.platform}:${userId}:${context.threadTs}`;
      default:
        throw new Error(`Platform not yet implemented: ${context.platform}`);
    }
  }

  /**
   * Build the full KV key with entity prefix
   */
  private buildKvKey(lookupKey: string): string {
    return `conversation:${lookupKey}`;
  }

  /**
   * Generate R2 storage path for session history
   * This is an infrastructure concern, not domain logic
   */
  private generateHistoryPath(userId: string, sessionId: string): string {
    return `conversations/${userId}/${sessionId}.jsonl`;
  }
}
