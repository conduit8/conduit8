import { CachedRepositoryBase } from '@worker/infrastructure/persistence/repositories/cached-repository-base';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { StorageError } from '@worker/infrastructure/errors/infrastructure.errors';

// Test entity
interface TestEntity {
  id: string;
  name: string;
}

// Concrete test implementation
class TestRepository extends CachedRepositoryBase<TestEntity> {
  public mockSaveToD1 = vi.fn();
  public mockDeleteFromD1 = vi.fn();

  protected async serialize(entity: TestEntity): Promise<string> {
    return JSON.stringify(entity);
  }

  protected async deserialize(data: string): Promise<TestEntity> {
    return JSON.parse(data);
  }

  protected async saveToD1(entity: TestEntity): Promise<void> {
    return this.mockSaveToD1(entity);
  }

  protected async deleteFromD1(entity: TestEntity): Promise<void> {
    return this.mockDeleteFromD1(entity);
  }
}

// Mock KV
const mockKV = {
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
} as unknown as KVNamespace;

const mockD1 = {} as D1Database;

describe('cachedRepositoryBase', () => {
  let repo: TestRepository;
  const testEntity: TestEntity = { id: 'test-id', name: 'Test Name' };

  beforeEach(() => {
    vi.clearAllMocks();
    repo = new TestRepository(mockKV, mockD1);
  });

  describe('findWithCache', () => {
    it('returns entity from KV when cached', async () => {
      mockKV.get.mockResolvedValue(JSON.stringify(testEntity));

      const queryD1 = vi.fn();
      const result = await repo.findWithCache('test:key', queryD1, undefined);

      expect(result).toEqual(testEntity);
      expect(mockKV.get).toHaveBeenCalledWith('test:key');
      expect(queryD1).not.toHaveBeenCalled();
    });

    it('queries D1 and backfills KV when not cached', async () => {
      mockKV.get.mockResolvedValue(null);
      const queryD1 = vi.fn().mockResolvedValue(testEntity);

      const result = await repo.findWithCache('test:key', queryD1, 3600);

      expect(result).toEqual(testEntity);
      expect(mockKV.get).toHaveBeenCalledWith('test:key');
      expect(queryD1).toHaveBeenCalled();
      expect(mockKV.put).toHaveBeenCalledWith(
        'test:key',
        JSON.stringify(testEntity),
        { expirationTtl: 3600 },
      );
    });

    it('returns null when not found in KV or D1', async () => {
      mockKV.get.mockResolvedValue(null);
      const queryD1 = vi.fn().mockResolvedValue(null);

      const result = await repo.findWithCache('test:key', queryD1, undefined);

      expect(result).toBeNull();
      expect(mockKV.put).not.toHaveBeenCalled();
    });

    it('passes parameters to queryD1 function', async () => {
      mockKV.get.mockResolvedValue(null);
      const queryD1 = vi.fn().mockResolvedValue(testEntity);

      await repo.findWithCache('test:key', queryD1, undefined, 'param1', 'param2');

      expect(queryD1).toHaveBeenCalledWith('param1', 'param2');
    });

    it('throws StorageError when KV fails', async () => {
      mockKV.get.mockRejectedValue(new Error('KV error'));
      const queryD1 = vi.fn();

      await expect(repo.findWithCache('test:key', queryD1, undefined))
        .rejects
        .toThrow(StorageError);
    });
  });

  describe('save', () => {
    it('saves to D1 and updates KV cache', async () => {
      repo.mockSaveToD1.mockResolvedValue(undefined);
      mockKV.put.mockResolvedValue(undefined);

      await repo.save(testEntity, 'test:key', 3600);

      expect(repo.mockSaveToD1).toHaveBeenCalledWith(testEntity);
      expect(mockKV.put).toHaveBeenCalledWith(
        'test:key',
        JSON.stringify(testEntity),
        { expirationTtl: 3600 },
      );
    });

    it('saves without TTL when not provided', async () => {
      repo.mockSaveToD1.mockResolvedValue(undefined);
      mockKV.put.mockResolvedValue(undefined);

      await repo.save(testEntity, 'test:key');

      expect(mockKV.put).toHaveBeenCalledWith(
        'test:key',
        JSON.stringify(testEntity),
        {},
      );
    });

    it('succeeds even if cache update fails', async () => {
      repo.mockSaveToD1.mockResolvedValue(undefined);
      mockKV.put.mockRejectedValue(new Error('Cache error'));

      await expect(repo.save(testEntity, 'test:key'))
        .resolves
        .not
        .toThrow();

      expect(repo.mockSaveToD1).toHaveBeenCalledWith(testEntity);
    });

    it('throws StorageError when D1 save fails', async () => {
      repo.mockSaveToD1.mockRejectedValue(new Error('D1 error'));

      await expect(repo.save(testEntity, 'test:key'))
        .rejects
        .toThrow(StorageError);
    });
  });

  describe('delete', () => {
    it('deletes from D1 and KV cache', async () => {
      repo.mockDeleteFromD1.mockResolvedValue(undefined);
      mockKV.delete.mockResolvedValue(undefined);

      await repo.delete('test:key', testEntity);

      expect(repo.mockDeleteFromD1).toHaveBeenCalledWith(testEntity);
      expect(mockKV.delete).toHaveBeenCalledWith('test:key');
    });

    it('succeeds even if cache delete fails', async () => {
      repo.mockDeleteFromD1.mockResolvedValue(undefined);
      mockKV.delete.mockRejectedValue(new Error('Cache error'));

      await expect(repo.delete('test:key', testEntity))
        .resolves
        .not
        .toThrow();

      expect(repo.mockDeleteFromD1).toHaveBeenCalledWith(testEntity);
    });

    it('throws StorageError when D1 delete fails', async () => {
      repo.mockDeleteFromD1.mockRejectedValue(new Error('D1 error'));

      await expect(repo.delete('test:key', testEntity))
        .rejects
        .toThrow(StorageError);
    });
  });

  describe('exists', () => {
    it('returns true when found in KV', async () => {
      mockKV.get.mockResolvedValue('cached-data');
      const checkD1 = vi.fn();

      const result = await repo.exists('test:key', checkD1);

      expect(result).toBe(true);
      expect(mockKV.get).toHaveBeenCalledWith('test:key');
      expect(checkD1).not.toHaveBeenCalled();
    });

    it('checks D1 when not in KV', async () => {
      mockKV.get.mockResolvedValue(null);
      const checkD1 = vi.fn().mockResolvedValue(true);

      const result = await repo.exists('test:key', checkD1);

      expect(result).toBe(true);
      expect(checkD1).toHaveBeenCalled();
    });

    it('returns false when not found anywhere', async () => {
      mockKV.get.mockResolvedValue(null);
      const checkD1 = vi.fn().mockResolvedValue(false);

      const result = await repo.exists('test:key', checkD1);

      expect(result).toBe(false);
    });

    it('passes parameters to checkD1 function', async () => {
      mockKV.get.mockResolvedValue(null);
      const checkD1 = vi.fn().mockResolvedValue(true);

      await repo.exists('test:key', checkD1, 'param1', 'param2');

      expect(checkD1).toHaveBeenCalledWith('param1', 'param2');
    });

    it('throws StorageError when check fails', async () => {
      mockKV.get.mockRejectedValue(new Error('Check error'));
      const checkD1 = vi.fn();

      await expect(repo.exists('test:key', checkD1))
        .rejects
        .toThrow(StorageError);
    });
  });
});
