import type { UUIDv4 } from '@kollektiv/core';

import {
  ConversationStarted,
  ConversationTurnCompleted,
  ConversationTurnFailed,
  ConversationTurnStarted,
  SessionRestoreRequired,
} from '@worker/domain/messages/events';

import { AggregateRoot } from '../base.models';

/**
 * Conversation represents a continuous dialogue context between a user and Claude.
 *
 * Key responsibilities:
 * 1. Maps platform-specific context (Slack DM thread) to Claude sessions
 * 2. Stores the claudeSessionId for future container restoration
 * 3. Enforces business rules for conversation flow
 * 4. Emits domain events for state changes
 *
 * Lifecycle:
 * - NEW: First message in thread → Create Conversation (no claudeSessionId yet)
 * - WITH_SESSION: Claude responds → Update with claudeSessionId
 *
 * Platform Context (Slack DMs only currently):
 * - Slack: { platform: 'slack', channel: 'D123456', threadTs: '1234567890.123456' }
 */
export class Conversation extends AggregateRoot {
  readonly id: UUIDv4; // Required by Entity base class

  // TODO: [CRITICAL - OPTIMISTIC LOCKING] Add version field to prevent lost updates
  // - Add `public readonly version: number = 1` to constructor
  // - Increment version on every state change (withClaudeSession, etc.)
  // - Repository must check version match before UPDATE
  // This prevents concurrent updates from overwriting each other's session IDs

  constructor(
    id: UUIDv4, // Internal conversation ID
    public readonly platformUserId: string, // User who owns this conversation
    public readonly platformContext: PlatformContext, // Platform-specific identifiers
    public claudeSessionId?: string, // Claude session (set after first response)
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {
    super();
    this.id = id;
  }

  /**
   * Start a new conversation for first message in thread
   */
  static startNew(
    platformUserId: string,
    platformContext: PlatformContext,
  ): Conversation {
    const id = crypto.randomUUID() as UUIDv4;
    const conversation = new Conversation(
      id,
      platformUserId,
      platformContext,
      undefined, // No Claude session yet
    );

    // Emit domain event for new conversation
    conversation.addEvent(new ConversationStarted(
      id,
      platformUserId,
      platformContext.platform,
      platformContext.channel,
      platformContext.threadTs,
    ));

    return conversation;
  }

  /**
   * Start a conversation turn when user sends a message
   * Business rule: Cannot start turn with empty message
   */
  startTurn(message: string | undefined): Conversation {
    if (!message?.trim()) {
      throw new Error('Cannot start turn with empty message');
    }

    const updated = new Conversation(
      this.id,
      this.platformUserId,
      this.platformContext,
      this.claudeSessionId,
      this.createdAt,
      new Date(), // Update timestamp
    );

    // Carry forward existing events
    updated.copyEventsFrom(this);

    updated.addEvent(new ConversationTurnStarted(
      this.id,
      this.platformUserId,
      this.claudeSessionId,
      message,
    ));

    return updated;
  }

  /**
   * Complete a conversation turn after Claude responds
   * Returns updated conversation with new session ID
   */
  completeTurn(newSessionId: string, cost?: number): Conversation {
    const sessionChanged = newSessionId !== this.claudeSessionId;

    // Use immutable update pattern
    const updated = new Conversation(
      this.id,
      this.platformUserId,
      this.platformContext,
      newSessionId,
      this.createdAt,
      new Date(), // Update timestamp
    );

    // Carry forward existing events
    updated.copyEventsFrom(this);

    // Emit domain event
    updated.addEvent(new ConversationTurnCompleted(
      this.id,
      this.platformUserId,
      newSessionId,
      this.claudeSessionId,
      sessionChanged,
      cost,
    ));

    return updated;
  }

  /**
   * Mark a conversation turn as failed
   * Captures partial session state if available
   * Returns updated conversation for consistency
   */
  failTurn(teamId: string, sessionId?: string, errMsg?: string): Conversation {
    // Use immutable update pattern for consistency
    const updated = new Conversation(
      this.id,
      this.platformUserId,
      this.platformContext,
      sessionId || this.claudeSessionId, // Preserve any session state we have
      this.createdAt,
      new Date(), // Update timestamp
    );

    // Carry forward existing events
    updated.copyEventsFrom(this);

    // Emit domain event with platform context for Slack notification
    updated.addEvent(new ConversationTurnFailed(
      this.id,
      this.platformUserId,
      teamId,
      this.platformContext.channel,
      this.platformContext.threadTs,
      sessionId, // Only include if we got a partial response
      errMsg, // Include error message if available
    ));

    return updated;
  }

  /**
   * Mark that session restoration is needed
   * Called when container restarts and previous session exists
   */
  requiresRestore(): Conversation {
    if (!this.claudeSessionId) {
      return this; // No session to restore, return unchanged
    }

    const updated = new Conversation(
      this.id,
      this.platformUserId,
      this.platformContext,
      this.claudeSessionId,
      this.createdAt,
      new Date(), // Update timestamp
    );

    // Carry forward existing events
    updated.copyEventsFrom(this);

    updated.addEvent(new SessionRestoreRequired(
      this.id,
      this.claudeSessionId,
      this.platformUserId,
    ));

    return updated;
  }

  /**
   * Convert to plain object for persistence
   */
  toPlainObject(): Record<string, any> {
    return {
      id: this.id,
      platformUserId: this.platformUserId,
      platformContext: this.platformContext,
      claudeSessionId: this.claudeSessionId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

/**
 * Slack thread context
 */
export interface SlackThreadContext {
  platform: 'slack';
  channel: string; // Channel ID (C123456) or DM ID (D123456)
  threadTs: string; // Thread timestamp (1234567890.123456)
}

/**
 * Platform-specific context that uniquely identifies a conversation
 */
export type PlatformContext = SlackThreadContext; // Union type for future platforms
