import { StorageError } from '@worker/infrastructure/errors/infrastructure.errors';

/**
 * Abstract base class for Cloudflare KV + D1 repositories.
 *
 * Handles the mechanical aspects of dual storage:
 * - KV operations (cache layer)
 * - Cache-first-then-D1 read pattern
 * - Parallel KV+D1 write operations
 * - Consistent error handling and logging
 *
 * Child repositories implement entity-specific logic:
 * - D1 queries (different tables/columns)
 * - Serialization (encryption only where needed)
 * - Domain mapping
 */
export abstract class CfCacheRepository<TEntity, TKey> {
  constructor(
    protected readonly kv: KVNamespace,
  ) {}

  /**
   * Cache-first read with D1 fallback and KV backfill
   */
  protected async findWithCache(key: TKey): Promise<TEntity | null> {
    const keyStr = this.getKeyString(key);
    const kvKey = this.getKvKey(keyStr);

    try {
      // Try KV first (fast)
      const kvResult = await this.kv.get(kvKey);
      if (kvResult) {
        return await this.deserializeFromKv(kvResult);
      }

      // Fallback to D1 (reliable)
      const d1Result = await this.findFromD1(key);
      if (d1Result) {
        console.log(`Cache miss for ${this.entityName}, backfilling KV`, { key: keyStr });
        // Backfill KV cache
        await this.kv.put(kvKey, await this.serializeForKv(d1Result));
        return d1Result;
      }

      // console.log(`${this.entityName} not found`, { key: keyStr });
      return null;
    }
    catch (error) {
      console.error(`Failed to find ${this.entityName}`, {
        key: keyStr,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new StorageError(
        `Failed to find ${this.entityName} for key ${keyStr}`,
        'read',
        undefined,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }

  /**
   * Parallel save to both KV and D1
   */
  protected async saveWithCache(entity: TEntity, key: TKey): Promise<TEntity> {
    const keyStr = this.getKeyString(key);
    const kvKey = this.getKvKey(keyStr);

    try {
      const serialized = await this.serializeForKv(entity);

      // Save to both KV and D1 for redundancy
      await Promise.all([this.kv.put(kvKey, serialized), this.saveToD1(entity)]);

      console.log(`${this.entityName} saved`, { key: keyStr });
      return entity;
    }
    catch (error) {
      console.error(`Failed to save ${this.entityName}`, {
        key: keyStr,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new StorageError(
        `Failed to save ${this.entityName} for key ${keyStr}`,
        'write',
        undefined,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }

  /**
   * Parallel delete from both KV and D1
   */
  protected async deleteWithCache(key: TKey): Promise<void> {
    const keyStr = this.getKeyString(key);
    const kvKey = this.getKvKey(keyStr);

    try {
      // Delete from both KV and D1
      await Promise.all([this.kv.delete(kvKey), this.deleteFromD1(key)]);
      console.log(`${this.entityName} deleted`, { key: keyStr });
    }
    catch (error) {
      console.error(`Failed to delete ${this.entityName}`, {
        key: keyStr,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new StorageError(
        `Failed to delete ${this.entityName} for key ${keyStr}`,
        'delete',
        undefined,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }

  /**
   * Check existence in KV first, then D1
   */
  protected async existsWithCache(key: TKey): Promise<boolean> {
    const keyStr = this.getKeyString(key);
    const kvKey = this.getKvKey(keyStr);

    try {
      // Check KV first (fast)
      const kvExists = (await this.kv.get(kvKey)) !== null;
      if (kvExists)
        return true;

      // Check D1 as fallback
      return await this.existsInD1(key);
    }
    catch (error) {
      console.error(`Failed to check ${this.entityName} existence`, {
        key: keyStr,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new StorageError(
        `Failed to check existence of ${this.entityName} for key ${keyStr}`,
        'read',
        undefined,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }

  // ========== Abstract Methods - Child Classes Must Implement ==========

  protected abstract get entityName(): string;
  protected abstract getKeyString(key: TKey): string;
  protected abstract getKvKey(keyStr: string): string;
  protected abstract serializeForKv(entity: TEntity): Promise<string>;
  protected abstract deserializeFromKv(data: string): Promise<TEntity>;
  protected abstract findFromD1(key: TKey): Promise<TEntity | null>;
  protected abstract saveToD1(entity: TEntity): Promise<void>;
  protected abstract deleteFromD1(key: TKey): Promise<void>;
  protected abstract existsInD1(key: TKey): Promise<boolean>;
}
