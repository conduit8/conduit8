import { beforeEach, describe, expect, it } from 'vitest';

import { ClaudeInstanceConfig } from '@worker/domain/models';
import { ValidationError } from '@worker/infrastructure/errors';

describe('claudeInstanceConfig', () => {
  const validData = {
    githubToken: 'ghp_abcd1234efgh5678',
    anthropicKey: 'sk-ant-api03-xyz789-abc123-def456',
  };

  const validDataWithFirecrawl = {
    githubToken: 'ghp_abcd1234efgh5678',
    anthropicKey: 'sk-ant-api03-xyz789-abc123-def456',
    firecrawlKey: 'fc-test-key-123',
  };

  describe('create', () => {
    it('creates config with valid data', () => {
      const config = ClaudeInstanceConfig.create(validData);

      expect(config.githubToken).toBe(validData.githubToken);
      expect(config.anthropicKey).toBe(validData.anthropicKey);
      expect(config.firecrawlKey).toBeUndefined();
    });

    it('creates config with optional firecrawl key', () => {
      const config = ClaudeInstanceConfig.create(validDataWithFirecrawl);

      expect(config.githubToken).toBe(validDataWithFirecrawl.githubToken);
      expect(config.anthropicKey).toBe(validDataWithFirecrawl.anthropicKey);
      expect(config.firecrawlKey).toBe(validDataWithFirecrawl.firecrawlKey);
    });

    it('throws ValidationError for invalid firecrawl key format', () => {
      const invalidData = { ...validData, firecrawlKey: 'invalid-key' };

      expect(() => ClaudeInstanceConfig.create(invalidData)).toThrow(ValidationError);
    });

    it('throws ValidationError for missing github token', () => {
      const invalidData = { ...validData, githubToken: '' };

      expect(() => ClaudeInstanceConfig.create(invalidData)).toThrow(ValidationError);
    });

    it('throws ValidationError for missing anthropic key', () => {
      const invalidData = { ...validData, anthropicKey: '' };

      expect(() => ClaudeInstanceConfig.create(invalidData)).toThrow(ValidationError);
    });

    it('throws ValidationError for invalid github token format', () => {
      const invalidData = { ...validData, githubToken: 'invalid-token' };

      expect(() => ClaudeInstanceConfig.create(invalidData)).toThrow(ValidationError);
    });

    it('throws ValidationError for invalid anthropic key format', () => {
      const invalidData = { ...validData, anthropicKey: 'sk-invalid-key' };

      expect(() => ClaudeInstanceConfig.create(invalidData)).toThrow(ValidationError);
    });
  });

  describe('update', () => {
    let config: ClaudeInstanceConfig;

    beforeEach(() => {
      config = ClaudeInstanceConfig.create(validData);
    });

    it('updates github token', () => {
      const updated = ClaudeInstanceConfig.create({
        ...config.toPlainObject(),
        githubToken: 'ghp_newtoken123',
      });

      expect(updated.githubToken).toBe('ghp_newtoken123');
      expect(updated.anthropicKey).toBe(config.anthropicKey); // unchanged
    });

    it('updates anthropic key', () => {
      const updated = ClaudeInstanceConfig.create({
        ...config.toPlainObject(),
        anthropicKey: 'sk-ant-api03-newkey789',
      });

      expect(updated.anthropicKey).toBe('sk-ant-api03-newkey789');
      expect(updated.githubToken).toBe(config.githubToken); // unchanged
    });

    it('throws ValidationError for invalid update data', () => {
      expect(() =>
        ClaudeInstanceConfig.create({
          ...config.toPlainObject(),
          githubToken: 'invalid',
        }),
      ).toThrow(ValidationError);
    });
  });

  describe('equals', () => {
    it('returns true for identical configs', () => {
      const config1 = ClaudeInstanceConfig.create(validData);
      const config2 = ClaudeInstanceConfig.create(validData);

      expect(config1.equals(config2)).toBe(true);
    });

    it('returns true for identical configs with firecrawl key', () => {
      const config1 = ClaudeInstanceConfig.create(validDataWithFirecrawl);
      const config2 = ClaudeInstanceConfig.create(validDataWithFirecrawl);

      expect(config1.equals(config2)).toBe(true);
    });

    it('returns false for different firecrawl keys', () => {
      const config1 = ClaudeInstanceConfig.create(validDataWithFirecrawl);
      const config2 = ClaudeInstanceConfig.create({
        ...validDataWithFirecrawl,
        firecrawlKey: 'fc-different-key-456',
      });

      expect(config1.equals(config2)).toBe(false);
    });

    it('returns false for different github tokens', () => {
      const config1 = ClaudeInstanceConfig.create(validData);
      const config2 = ClaudeInstanceConfig.create({
        ...validData,
        githubToken: 'ghp_different123',
      });

      expect(config1.equals(config2)).toBe(false);
    });

    it('returns false for different anthropic keys', () => {
      const config1 = ClaudeInstanceConfig.create(validData);
      const config2 = ClaudeInstanceConfig.create({
        ...validData,
        anthropicKey: 'sk-ant-api03-different456',
      });

      expect(config1.equals(config2)).toBe(false);
    });
  });

  describe('toPlainObject', () => {
    it('serializes to plain object', () => {
      const config = ClaudeInstanceConfig.create(validData);
      const plain = config.toPlainObject();

      expect(plain).toEqual({
        githubToken: validData.githubToken,
        anthropicKey: validData.anthropicKey,
        firecrawlKey: undefined,
      });
    });

    it('serializes to plain object with firecrawl key', () => {
      const config = ClaudeInstanceConfig.create(validDataWithFirecrawl);
      const plain = config.toPlainObject();

      expect(plain).toEqual({
        githubToken: validDataWithFirecrawl.githubToken,
        anthropicKey: validDataWithFirecrawl.anthropicKey,
        firecrawlKey: validDataWithFirecrawl.firecrawlKey,
      });
    });
  });

  describe('immutability', () => {
    it('creating with updated values returns new instance', () => {
      const config1 = ClaudeInstanceConfig.create(validData);
      const config2 = ClaudeInstanceConfig.create({
        ...config1.toPlainObject(),
        githubToken: 'ghp_updated123',
      });

      expect(config1).not.toBe(config2);
      expect(config1.githubToken).toBe(validData.githubToken);
      expect(config2.githubToken).toBe('ghp_updated123');
    });

    it('create returns new instance', () => {
      const config1 = ClaudeInstanceConfig.create(validData);
      const config2 = ClaudeInstanceConfig.create(validData);

      expect(config1).not.toBe(config2);
      expect(config1.equals(config2)).toBe(true);
    });
  });
});
