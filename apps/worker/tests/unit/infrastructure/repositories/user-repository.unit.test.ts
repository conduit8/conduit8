import { describe, expect, it, vi } from 'vitest';

import { ClaudeInstanceConfig } from '@worker/domain/models/user/claude-instance-config';
import { User } from '@worker/domain/models/user/user';
import { UserRepository } from '@worker/infrastructure/persistence/repositories/user-repository';

describe('userRepository', () => {
  const mockKv = {} as KVNamespace;
  const mockD1 = {} as D1Database;

  const repository = new UserRepository(mockKv, mockD1);

  describe('key generation', () => {
    it('should generate correct KV key', () => {
      const key = (repository as any).getKvKey('user123');
      expect(key).toBe('user_config:user123');
    });

    it('should use correct entity name', () => {
      expect((repository as any).entityName).toBe('User');
    });
  });

  describe('serialization', () => {
    it('should serialize user to JSON with correct structure', async () => {
      const config = ClaudeInstanceConfig.create({
        githubToken: 'ghp_test',
        anthropicKey: 'sk-ant-test',
      });
      const user = new User('user123', 'slack', config, new Date('2024-01-01'), new Date('2024-01-02'));

      const serialized = await (repository as any).serializeForKv(user);
      const parsed = JSON.parse(serialized);

      expect(parsed.platformUserId).toBe('user123');
      expect(parsed.platform).toBe('slack');
      expect(parsed.githubToken).toBe('ghp_test');
      expect(parsed.anthropicKey).toBe('sk-ant-test');
      expect(parsed.firecrawlKey).toBeUndefined();
      expect(parsed.createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(parsed.updatedAt).toBe('2024-01-02T00:00:00.000Z');
    });

    it('should deserialize JSON to User domain model', async () => {
      const data = {
        platformUserId: 'user123',
        platform: 'slack',
        githubToken: 'ghp_test',
        anthropicKey: 'sk-ant-test',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      };

      const user = await (repository as any).deserializeFromKv(JSON.stringify(data));

      expect(user.platformUserId).toBe('user123');
      expect(user.platform).toBe('slack');
      expect(user.config.githubToken).toBe('ghp_test');
      expect(user.config.anthropicKey).toBe('sk-ant-test');
      expect(user.config.firecrawlKey).toBeUndefined();
    });
  });

  describe('mapToDomainModel', () => {
    it('should map database result to User', () => {
      const dbResult = {
        platformUserId: 'user123',
        platform: 'slack',
        githubToken: 'ghp_test',
        anthropicKey: 'sk-ant-test',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      const user = (repository as any).mapToDomainModel(dbResult);

      expect(user.platformUserId).toBe('user123');
      expect(user.platform).toBe('slack');
      expect(user.config.githubToken).toBe('ghp_test');
      expect(user.config.anthropicKey).toBe('sk-ant-test');
      expect(user.config.firecrawlKey).toBeUndefined();
    });

    it('should map database result with firecrawl key to User', () => {
      const dbResult = {
        platformUserId: 'user123',
        platform: 'slack',
        githubToken: 'ghp_test',
        anthropicKey: 'sk-ant-test',
        firecrawlKey: 'fc-test123',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      const user = (repository as any).mapToDomainModel(dbResult);

      expect(user.config.firecrawlKey).toBe('fc-test123');
    });

    it('should handle timestamp strings from database', () => {
      const dbResult = {
        platformUserId: 'user123',
        platform: 'slack',
        githubToken: 'ghp_test',
        anthropicKey: 'sk-ant-test',
        createdAt: 1704067200000, // timestamp as number
        updatedAt: '2024-01-02T00:00:00.000Z', // timestamp as string
      };

      const user = (repository as any).mapToDomainModel(dbResult);

      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });
  });
});
