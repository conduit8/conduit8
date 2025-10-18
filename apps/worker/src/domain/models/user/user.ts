import { UserConfigured } from '@worker/domain/messages/events';
import { ClaudeInstanceConfig } from '@worker/domain/models/user/claude-instance-config';

import { AggregateRoot } from '../base.models';

/**
 * User's persistent Claude Code configuration and UI state.
 *
 * Storage Migration Plan:
 * - Currently: Durable Object SQLite
 * - Target: KV (fast access) + D1 (reliable backup) with encryption
 *
 * Lifecycle:
 * - Created when user first sets up Claude Code
 * - Updated when user changes configuration or UI interactions
 * - Persists across worker restarts and deployments
 *
 * Contains:
 * - User ID and Claude configuration (API credentials)
 * - UI state (welcome message shown)
 * - Creation and update timestamps
 *
 * Container runtime state is managed separately by ClaudeContainerDO.
 */
export class User extends AggregateRoot {
  readonly id: string; // Required by Entity base class (using platformUserId as ID)

  constructor(
    public readonly platformUserId: string, // Platform-specific ID (e.g., Slack U123456)
    public readonly platform: string = 'slack',
    public readonly config: ClaudeInstanceConfig,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {
    super();
    if (!config) {
      throw new Error('Can not create User without config');
    }
    this.id = platformUserId; // Use platformUserId as entity ID
  }

  /**
   * Update Claude configuration
   */
  updateConfig(config: ClaudeInstanceConfig): User {
    const updated = new User(
      this.platformUserId,
      this.platform,
      config,
      this.createdAt,
      new Date(),
    );

    // Emit domain event for configuration update
    // Note: teamId not available at entity level, event created in command handler instead
    // updated.addEvent(new UserConfigurationUpdated(
    //   this.platformUserId,
    //   this.platform,
    // ));

    return updated;
  }

  /**
   * Create new user configuration with validated config
   */
  static create(
    platformUserId: string,
    config: ClaudeInstanceConfig,
    platform: 'slack' | 'discord' | 'telegram' = 'slack',
  ): User {
    const user = new User(platformUserId, platform, config);

    // Emit domain event for new user configuration
    user.addEvent(new UserConfigured(
      platformUserId,
      platform,
    ));

    return user;
  }

  /**
   * Convert entity to plain object for persistence
   * TODO: Move to repository mapper when migrating to KV/D1
   */
  toPlainObject(): Record<string, unknown> {
    return {
      platformUserId: this.platformUserId,
      platform: this.platform,
      config: {
        githubToken: this.config.githubToken,
        anthropicKey: this.config.anthropicKey,
        firecrawlKey: this.config.firecrawlKey,
      },
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Create from stored data (deserialization)
   * TODO: Move to repository mapper when migrating to KV/D1
   */
  static fromPlainObject(data: Record<string, unknown>): User {
    // Let ClaudeInstanceConfig.create validate - it will throw if tokens are missing/invalid
    const config = ClaudeInstanceConfig.create(data.config);

    // Use constructor directly for deserialization (no events)
    return new User(
      data.platformUserId as string,
      data.platform as string,
      config,
      new Date(data.createdAt as string),
      new Date(data.updatedAt as string),
    );
  }
}
