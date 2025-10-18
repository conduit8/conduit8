import { StorageError } from '@worker/infrastructure/errors/infrastructure.errors';

/**
 * Base class for repositories with KV caching + D1 persistence
 *
 * Provides flexible caching flow without forcing specific query patterns.
 * Subclasses provide their own D1 queries with whatever parameters they need.
 *
 */
export abstract class CachedRepositoryBase<TEntity> {
  constructor(
    protected readonly kv: KVNamespace,
    protected readonly d1: D1Database,
  ) {}

  /**
   * Execute a D1 query with automatic KV caching
   *
   * @param kvKey - The full KV key to use for caching
   * @param queryD1 - Function that queries D1 with any parameters
   * @param ttl - Optional TTL in seconds for cache expiration
   * @param params - Parameters to pass to the query function
   * @returns The entity if found, null otherwise
   *
   * @example
   * ```typescript
   * return this.findWithCache(
   *   `conversation:${userId}:${threadTs}`,
   *   async (uid, ts) => {
   *     const result = await this.d1.prepare('SELECT * FROM table WHERE user_id = ? AND thread = ?')
   *       .bind(uid, ts)
   *       .first();
   *     return result ? this.mapToEntity(result) : null;
   *   },
   *   86400, // 24 hours TTL
   *   userId,
   *   threadTs
   * );
   * ```
   */
  protected async findWithCache<TParams extends any[]>(
    kvKey: string,
    queryD1: (...params: TParams) => Promise<TEntity | null>,
    ttl: number | undefined,
    ...params: TParams
  ): Promise<TEntity | null> {
    try {
      // 1. Check cache first (fast path)
      const cached = await this.kv.get(kvKey);
      if (cached) {
        return await this.deserialize(cached);
      }

      // 2. Query D1 with provided parameters
      const entity = await queryD1(...params);

      // 3. Backfill cache if entity found
      if (entity) {
        const options: KVNamespacePutOptions = {};
        if (ttl) {
          options.expirationTtl = ttl;
        }
        await this.kv.put(kvKey, await this.serialize(entity), options);
        console.log('Cache miss, backfilled', { kvKey, ttl });
      }

      return entity;
    }
    catch (error) {
      console.error('Failed to find entity', {
        kvKey,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new StorageError(
        `Failed to find entity with key ${kvKey}`,
        'read',
        undefined,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }

  /**
   * Save entity to both KV cache and D1 in parallel
   *
   * @param entity - The entity to save
   * @param kvKey - The full KV key to use for caching
   * @param ttl - Optional TTL in seconds for cache expiration
   */
  protected async save(entity: TEntity, kvKey: string, ttl?: number): Promise<void> {
    try {
      // 1. Save to D1 first (source of truth)
      await this.saveToD1(entity);

      // 2. Update cache (best effort - don't fail if cache fails)
      try {
        const serialized = await this.serialize(entity);
        const kvOptions: KVNamespacePutOptions = {};
        if (ttl) {
          kvOptions.expirationTtl = ttl;
        }
        await this.kv.put(kvKey, serialized, kvOptions);
      }
      catch (cacheError) {
        // Cache failed but D1 succeeded - this is OK
        console.warn('Cache update failed after D1 save (will refresh on next read)', {
          kvKey,
          error: cacheError instanceof Error ? cacheError.message : String(cacheError),
        });
      }
    }
    catch (error) {
      console.error('Failed to save entity', {
        kvKey,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new StorageError(
        `Failed to save entity with key ${kvKey}`,
        'write',
        undefined,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }

  /**
   * Delete entity from both KV cache and D1 in parallel
   *
   * @param kvKey - The full KV key to use for deletion
   * @param entity - The entity to delete from D1
   */
  protected async delete(kvKey: string, entity: TEntity): Promise<void> {
    try {
      // 1. Delete from D1 first (source of truth)
      await this.deleteFromD1(entity);

      // 2. Delete from cache (best effort)
      try {
        await this.kv.delete(kvKey);
      }
      catch (cacheError) {
        // Cache delete failed but D1 succeeded - this is OK
        console.warn('Cache delete failed after D1 delete', {
          kvKey,
          error: cacheError instanceof Error ? cacheError.message : String(cacheError),
        });
      }

      console.log('Entity deleted', { kvKey });
    }
    catch (error) {
      console.error('Failed to delete entity', {
        kvKey,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new StorageError(
        `Failed to delete entity with key ${kvKey}`,
        'delete',
        undefined,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }

  /**
   * Check if entity exists in cache or D1
   *
   * @param kvKey - The full KV key to check
   * @param checkD1 - Function to check existence in D1
   */
  protected async exists<TParams extends any[]>(
    kvKey: string,
    checkD1: (...params: TParams) => Promise<boolean>,
    ...params: TParams
  ): Promise<boolean> {
    try {
      // Check KV first (fast)
      const kvExists = (await this.kv.get(kvKey)) !== null;
      if (kvExists)
        return true;

      // Check D1 as fallback
      return await checkD1(...params);
    }
    catch (error) {
      console.error('Failed to check entity existence', {
        kvKey,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new StorageError(
        `Failed to check existence for key ${kvKey}`,
        'read',
        undefined,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }

  // ========== Abstract Methods - Minimal Set ==========

  /**
   * Serialize entity for KV storage
   */
  protected abstract serialize(entity: TEntity): Promise<string>;

  /**
   * Deserialize entity from KV storage
   */
  protected abstract deserialize(data: string): Promise<TEntity>;

  /**
   * Save entity to D1 (insert or update)
   */
  protected abstract saveToD1(entity: TEntity): Promise<void>;

  /**
   * Delete entity from D1
   */
  protected abstract deleteFromD1(entity: TEntity): Promise<void>;
}
