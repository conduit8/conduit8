import { describe, expect, it } from 'vitest';

import { ClaudeInstanceConfig, User } from '@worker/domain/models';
import { ValidationError } from '@worker/infrastructure/errors';

describe('claudeInstanceConfig', () => {
  const validConfigData = {
    githubToken: 'ghp_abcd1234',
    anthropicKey: 'sk-ant-api03-xyz',
  };

  describe('validation', () => {
    it('creates valid config', () => {
      const config = ClaudeInstanceConfig.create(validConfigData);
      expect(config.githubToken).toBe(validConfigData.githubToken);
      expect(config.anthropicKey).toBe(validConfigData.anthropicKey);
    });

    it('rejects empty credentials', () => {
      const invalidData = { ...validConfigData, githubToken: '' };
      expect(() => ClaudeInstanceConfig.create(invalidData)).toThrow(
        ValidationError,
      );
    });
  });

  describe('updates', () => {
    it('updates single field', () => {
      const config = ClaudeInstanceConfig.create(validConfigData);
      const updated = ClaudeInstanceConfig.create({
        ...config.toPlainObject(),
        githubToken: 'ghp_new_token',
      });

      expect(updated.githubToken).toBe('ghp_new_token');
      expect(updated.anthropicKey).toBe(config.anthropicKey); // unchanged
    });

    it('validates updated fields', () => {
      const config = ClaudeInstanceConfig.create(validConfigData);
      expect(() => ClaudeInstanceConfig.create({
        ...config.toPlainObject(),
        githubToken: 'invalid_token',
      })).toThrow(
        ValidationError,
      );
    });
  });
});

describe('user Entity', () => {
  const validConfig = ClaudeInstanceConfig.create({
    githubToken: 'ghp_abcd1234',
    anthropicKey: 'sk-ant-api03-xyz',
  });

  describe('creation', () => {
    it('creates user with valid config', () => {
      const user = User.create('U123456789', validConfig);

      expect(user.platformUserId).toBe('U123456789');
      expect(user.platform).toBe('slack');
      expect(user.config).toBe(validConfig);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('requires valid config', () => {
      // TypeScript prevents this, but testing runtime safety
      expect(() => new User('U123456789', 'slack', null as any)).toThrow();
    });

    it('creates user with custom platform', () => {
      const user = User.create('U123456789', validConfig, 'discord');
      expect(user.platform).toBe('discord');
    });
  });

  describe('updates', () => {
    it('updates config', () => {
      const user = User.create('U123456789', validConfig);
      const newConfig = ClaudeInstanceConfig.create({
        githubToken: 'ghp_new_token',
        anthropicKey: 'sk-ant-new-key',
      });

      const updated = user.updateConfig(newConfig);

      expect(updated.config).toBe(newConfig);
      expect(updated.platformUserId).toBe(user.platformUserId);
      expect(updated.platform).toBe(user.platform);
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(user.updatedAt.getTime());
    });
  });

  describe('serialization', () => {
    it('serializes to plain object', () => {
      const user = User.create('U123456789', validConfig);
      const plain = user.toPlainObject();

      expect(plain.platformUserId).toBe('U123456789');
      expect(plain.platform).toBe('slack');
      expect(plain.config).toEqual({
        githubToken: validConfig.githubToken,
        anthropicKey: validConfig.anthropicKey,
      });
      expect(typeof plain.createdAt).toBe('string');
      expect(typeof plain.updatedAt).toBe('string');
    });

    it('deserializes from plain object', () => {
      const user = User.create('U123456789', validConfig);
      const plain = user.toPlainObject();
      const restored = User.fromPlainObject(plain);

      expect(restored.platformUserId).toBe(user.platformUserId);
      expect(restored.platform).toBe(user.platform);
      expect(restored.config.githubToken).toBe(user.config.githubToken);
      expect(restored.config.anthropicKey).toBe(user.config.anthropicKey);
      expect(restored.createdAt.getTime()).toBe(user.createdAt.getTime());
    });

    it('fails to deserialize without config data', () => {
      const invalidPlain = {
        platformUserId: 'U123456789',
        platform: 'slack',
        config: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(() => User.fromPlainObject(invalidPlain)).toThrow();
    });
  });
});
