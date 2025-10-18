import type { IUserRepository } from '@worker/domain/repositories';

import { ClaudeInstanceConfig, User } from '@worker/domain/models';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';

import { platformUsers } from '@worker/infrastructure/persistence/database/schema/platform-users';

import { CfCacheRepository } from './cf-cache-repository';

export class UserRepository
  extends CfCacheRepository<User, string>
  implements IUserRepository {
  private readonly db;

  constructor(
    kv: KVNamespace,
    d1: D1Database,
  ) {
    super(kv);
    this.db = drizzle(d1);
  }

  // ========== Repository Interface (PUBLIC) ==========
  async findByPlatformId(platformUserId: string): Promise<User | null> {
    return this.findWithCache(platformUserId);
  }

  async save(user: User): Promise<User> {
    return this.saveWithCache(user, user.platformUserId);
  }

  async deleteByPlatformId(platformUserId: string): Promise<void> {
    return this.deleteWithCache(platformUserId);
  }

  async exists(platformUserId: string): Promise<boolean> {
    return this.existsWithCache(platformUserId);
  }

  // ========== Abstract Implementation (PRIVATE) ==========
  protected get entityName(): string {
    return 'User';
  }

  protected getKeyString(userId: string): string {
    return userId;
  }

  protected getKvKey(userId: string): string {
    return `user_config:${userId}`;
  }

  protected async serializeForKv(user: User): Promise<string> {
    return JSON.stringify({
      platformUserId: user.platformUserId,
      platform: user.platform,
      githubToken: user.config.githubToken,
      anthropicKey: user.config.anthropicKey,
      firecrawlKey: user.config.firecrawlKey,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    });
  }

  protected async deserializeFromKv(data: string): Promise<User> {
    const parsed = JSON.parse(data);
    return this.mapToDomainModel(parsed);
  }

  protected async findFromD1(userId: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(platformUsers)
      .where(eq(platformUsers.platformUserId, userId))
      .get();

    if (!result)
      return null;

    return this.mapToDomainModel(result);
  }

  protected async saveToD1(user: User): Promise<void> {
    await this.db
      .insert(platformUsers)
      .values({
        platformUserId: user.platformUserId,
        platform: user.platform,
        githubToken: user.config.githubToken,
        anthropicKey: user.config.anthropicKey,
        firecrawlKey: user.config.firecrawlKey,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      .onConflictDoUpdate({
        target: platformUsers.platformUserId,
        set: {
          platform: user.platform,
          githubToken: user.config.githubToken,
          anthropicKey: user.config.anthropicKey,
          firecrawlKey: user.config.firecrawlKey,
          updatedAt: user.updatedAt,
        },
      })
      .execute();
  }

  protected async deleteFromD1(userId: string): Promise<void> {
    await this.db
      .delete(platformUsers)
      .where(eq(platformUsers.platformUserId, userId))
      .execute();
  }

  protected async existsInD1(userId: string): Promise<boolean> {
    const result = await this.db
      .select({ exists: platformUsers.platformUserId })
      .from(platformUsers)
      .where(eq(platformUsers.platformUserId, userId))
      .get();
    // Drizzle returns undefined (not null) when no rows found
    return result !== undefined;
  }

  // ========== Entity-Specific Logic (PRIVATE) ==========
  private mapToDomainModel(data: any): User {
    const claudeConfig = ClaudeInstanceConfig.create({
      githubToken: data.githubToken,
      anthropicKey: data.anthropicKey,
      firecrawlKey: data.firecrawlKey,
    });

    return new User(
      data.platformUserId,
      data.platform,
      claudeConfig,
      data.createdAt instanceof Date ? data.createdAt : new Date(data.createdAt),
      data.updatedAt instanceof Date ? data.updatedAt : new Date(data.updatedAt),
    );
  }
}
