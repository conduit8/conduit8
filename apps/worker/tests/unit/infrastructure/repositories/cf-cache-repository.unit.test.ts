import { CfCacheRepository } from '@worker/infrastructure/persistence/repositories/cf-cache-repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { StorageError } from '@worker/infrastructure/errors/infrastructure.errors';

// Test entity
interface TestEntity {
  id: string;
  data: string;
}

// Concrete test implementation
class TestCacheRepository extends CfCacheRepository<TestEntity, string> {
  // Mock functions - easy to spy on
  public mockFindFromD1 = vi.fn();
  public mockSaveToD1 = vi.fn();
  public mockDeleteFromD1 = vi.fn();
  public mockExistsInD1 = vi.fn();

  protected get entityName(): string {
    return 'TestEntity';
  }

  protected getKeyString(key: string): string {
    return key;
  }

  protected getKvKey(keyStr: string): string {
    return `test:${keyStr}`;
  }

  protected async serializeForKv(entity: TestEntity): Promise<string> {
    return JSON.stringify(entity);
  }

  protected async deserializeFromKv(data: string): Promise<TestEntity> {
    return JSON.parse(data);
  }

  protected async findFromD1(key: string): Promise<TestEntity | null> {
    return this.mockFindFromD1(key);
  }

  protected async saveToD1(entity: TestEntity): Promise<void> {
    return this.mockSaveToD1(entity);
  }

  protected async deleteFromD1(key: string): Promise<void> {
    return this.mockDeleteFromD1(key);
  }

  protected async existsInD1(key: string): Promise<boolean> {
    return this.mockExistsInD1(key);
  }
}

// Mock KV and D1
const mockKV = {
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

describe('cfCacheRepository', () => {
  let repo: TestCacheRepository;
  const testEntity: TestEntity = { id: 'test-id', data: 'test-data' };

  beforeEach(() => {
    vi.clearAllMocks();
    repo = new TestCacheRepository(mockKV as any);
  });

  describe('findWithCache', () => {
    it('returns entity from KV when found', async () => {
      // Arrange
      mockKV.get.mockResolvedValue(JSON.stringify(testEntity));

      // Act
      const result = await repo.findWithCache('test-id');

      // Assert
      expect(result).toEqual(testEntity);
      expect(mockKV.get).toHaveBeenCalledWith('test:test-id');
      expect(repo.mockFindFromD1).not.toHaveBeenCalled();
    });

    it('falls back to D1 and backfills KV when not in KV', async () => {
      // Arrange
      mockKV.get.mockResolvedValue(null);
      repo.mockFindFromD1.mockResolvedValue(testEntity);

      // Act
      const result = await repo.findWithCache('test-id');

      // Assert
      expect(result).toEqual(testEntity);
      expect(mockKV.get).toHaveBeenCalledWith('test:test-id');
      expect(repo.mockFindFromD1).toHaveBeenCalledWith('test-id');
      expect(mockKV.put).toHaveBeenCalledWith('test:test-id', JSON.stringify(testEntity));
    });

    it('returns null when not found in either KV or D1', async () => {
      // Arrange
      mockKV.get.mockResolvedValue(null);
      repo.mockFindFromD1.mockResolvedValue(null);

      // Act
      const result = await repo.findWithCache('test-id');

      // Assert
      expect(result).toBeNull();
      expect(mockKV.get).toHaveBeenCalledWith('test:test-id');
      expect(repo.mockFindFromD1).toHaveBeenCalledWith('test-id');
      expect(mockKV.put).not.toHaveBeenCalled();
    });

    it('throws StorageError when KV fails', async () => {
      // Arrange
      mockKV.get.mockRejectedValue(new Error('KV error'));

      // Act & Assert
      await expect(repo.findWithCache('test-id')).rejects.toThrow(StorageError);
      await expect(repo.findWithCache('test-id')).rejects.toThrow('Failed to find TestEntity for key test-id');
    });
  });

  describe('saveWithCache', () => {
    it('saves to both KV and D1 in parallel', async () => {
      // Arrange
      mockKV.put.mockResolvedValue(undefined);
      repo.mockSaveToD1.mockResolvedValue(undefined);

      // Act
      const result = await repo.saveWithCache(testEntity, 'test-id');

      // Assert
      expect(result).toEqual(testEntity);
      expect(mockKV.put).toHaveBeenCalledWith('test:test-id', JSON.stringify(testEntity));
      expect(repo.mockSaveToD1).toHaveBeenCalledWith(testEntity);
    });

    it('throws StorageError when save fails', async () => {
      // Arrange
      mockKV.put.mockRejectedValue(new Error('KV error'));

      // Act & Assert
      await expect(repo.saveWithCache(testEntity, 'test-id')).rejects.toThrow(StorageError);
      await expect(repo.saveWithCache(testEntity, 'test-id')).rejects.toThrow(
        'Failed to save TestEntity for key test-id',
      );
    });
  });

  describe('deleteWithCache', () => {
    it('deletes from both KV and D1 in parallel', async () => {
      // Arrange
      mockKV.delete.mockResolvedValue(undefined);
      repo.mockDeleteFromD1.mockResolvedValue(undefined);

      // Act
      await repo.deleteWithCache('test-id');

      // Assert
      expect(mockKV.delete).toHaveBeenCalledWith('test:test-id');
      expect(repo.mockDeleteFromD1).toHaveBeenCalledWith('test-id');
    });

    it('throws StorageError when delete fails', async () => {
      // Arrange
      mockKV.delete.mockRejectedValue(new Error('KV error'));

      // Act & Assert
      await expect(repo.deleteWithCache('test-id')).rejects.toThrow(StorageError);
      await expect(repo.deleteWithCache('test-id')).rejects.toThrow('Failed to delete TestEntity for key test-id');
    });
  });

  describe('existsWithCache', () => {
    it('returns true when found in KV', async () => {
      // Arrange
      mockKV.get.mockResolvedValue('some-data');

      // Act
      const result = await repo.existsWithCache('test-id');

      // Assert
      expect(result).toBe(true);
      expect(mockKV.get).toHaveBeenCalledWith('test:test-id');
      expect(repo.mockExistsInD1).not.toHaveBeenCalled();
    });

    it('falls back to D1 when not in KV', async () => {
      // Arrange
      mockKV.get.mockResolvedValue(null);
      repo.mockExistsInD1.mockResolvedValue(true);

      // Act
      const result = await repo.existsWithCache('test-id');

      // Assert
      expect(result).toBe(true);
      expect(mockKV.get).toHaveBeenCalledWith('test:test-id');
      expect(repo.mockExistsInD1).toHaveBeenCalledWith('test-id');
    });

    it('returns false when not found in either KV or D1', async () => {
      // Arrange
      mockKV.get.mockResolvedValue(null);
      repo.mockExistsInD1.mockResolvedValue(false);

      // Act
      const result = await repo.existsWithCache('test-id');

      // Assert
      expect(result).toBe(false);
    });
  });
});
