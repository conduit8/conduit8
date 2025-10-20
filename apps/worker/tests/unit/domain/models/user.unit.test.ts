import { ClaudeInstanceConfig } from '@worker/domain/models/user/claude-instance-config';
import { User } from '@worker/domain/models/user/user';
import { describe, expect, it } from 'vitest';

import { UserConfigurationUpdated, UserConfigured } from '@worker/domain/messages/events';

describe('user Entity', () => {
  const validConfig = ClaudeInstanceConfig.create({
    githubToken: 'ghp_testtoken123',
    anthropicKey: 'sk-ant-testkey123',
  });

  describe('user.create()', () => {
    it('creates user with valid config', () => {
      const user = User.create('U123456', validConfig);

      expect(user.platformUserId).toBe('U123456');
      expect(user.platform).toBe('slack');
      expect(user.config).toBe(validConfig);
    });

    it('emits UserConfigured event when created', () => {
      const user = User.create('U123456', validConfig);
      const events = user.collectEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(UserConfigured);
      expect(events[0].userId).toBe('U123456');
    });
  });

  describe('updateConfig()', () => {
    it('returns new user instance with updated config', () => {
      const user = User.create('U123456', validConfig);
      user.clearEvents(); // Clear creation event

      const newConfig = ClaudeInstanceConfig.create({
        githubToken: 'ghp_newtoken456',
        anthropicKey: 'sk-ant-newkey456',
      });

      const updated = user.updateConfig(newConfig);

      expect(updated).not.toBe(user); // Different instance
      expect(updated.config).toBe(newConfig);
      expect(updated.platformUserId).toBe('U123456'); // Same user ID
    });

    it('does not emit UserConfigurationUpdated event (emitted by command handler instead)', () => {
      const user = User.create('U123456', validConfig);
      user.clearEvents();

      const newConfig = ClaudeInstanceConfig.create({
        githubToken: 'ghp_newtoken456',
        anthropicKey: 'sk-ant-newkey456',
      });

      const updated = user.updateConfig(newConfig);
      const events = updated.collectEvents();

      // Event is not emitted at entity level because teamId is not available
      // Event is created in the command handler instead
      expect(events).toHaveLength(0);
    });
  });

  describe('serialization', () => {
    it('toPlainObject serializes user correctly', () => {
      const user = User.create('U123456', validConfig);
      const plain = user.toPlainObject();

      expect(plain.platformUserId).toBe('U123456');
      expect(plain.platform).toBe('slack');
      expect(plain.config.githubToken).toBe('ghp_testtoken123');
      expect(plain.config.anthropicKey).toBe('sk-ant-testkey123');
      expect(plain.config.firecrawlKey).toBeUndefined();
      expect(plain.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/); // ISO string
    });

    it('toPlainObject serializes user with firecrawl key correctly', () => {
      const configWithFirecrawl = ClaudeInstanceConfig.create({
        githubToken: 'ghp_testtoken123',
        anthropicKey: 'sk-ant-testkey123',
        firecrawlKey: 'fc-testkey123',
      });
      const user = User.create('U123456', configWithFirecrawl);
      const plain = user.toPlainObject();

      expect(plain.config.firecrawlKey).toBe('fc-testkey123');
    });

    it('fromPlainObject deserializes user correctly', () => {
      const originalUser = User.create('U123456', validConfig);
      const plain = originalUser.toPlainObject();

      const restoredUser = User.fromPlainObject(plain);

      expect(restoredUser.platformUserId).toBe('U123456');
      expect(restoredUser.platform).toBe('slack');
      expect(restoredUser.config.githubToken).toBe('ghp_testtoken123');
      expect(restoredUser.config.anthropicKey).toBe('sk-ant-testkey123');
    });

    it('fromPlainObject does not emit events', () => {
      const plain = {
        platformUserId: 'U123456',
        platform: 'slack',
        config: {
          githubToken: 'ghp_testtoken123',
          anthropicKey: 'sk-ant-testkey123',
          firecrawlKey: undefined,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const user = User.fromPlainObject(plain);
      const events = user.collectEvents();

      expect(events).toHaveLength(0); // No events on deserialization
    });

    it('fromPlainObject throws if config is invalid', () => {
      const plain = {
        platformUserId: 'U123456',
        platform: 'slack',
        config: {
          githubToken: 'invalid-token', // Not ghp_ or github_pat_
          anthropicKey: 'sk-ant-testkey123',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(() => User.fromPlainObject(plain)).toThrow();
    });

    it('fromPlainObject throws if config is missing', () => {
      const plain = {
        platformUserId: 'U123456',
        platform: 'slack',
        // Missing config
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(() => User.fromPlainObject(plain)).toThrow();
    });
  });
});
