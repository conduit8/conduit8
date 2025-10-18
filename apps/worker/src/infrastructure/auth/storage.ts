import type { SecondaryStorage } from 'better-auth';

import type { RateLimiterDO } from '@worker/infrastructure/persistence/durable-objects/rate-limiter-do';

/**
 * Storage adapters for Better Auth
 * Handles KV secondary storage and rate limiting via Durable Objects
 */

/**
 * Interface for rate limit data
 */
interface RateLimit {
  key: string;
  count: number;
  lastRequest: number;
}

/**
 * Better Auth rate limit storage interface
 */
interface RateLimitStorage {
  get: (key: string) => Promise<RateLimit | undefined>;
  set: (key: string, value: RateLimit) => Promise<void>;
}

/**
 * Create KV storage adapter for Better Auth sessions
 */
export function createKVStorage(kv: KVNamespace): SecondaryStorage {
  return {
    async get(key: string): Promise<string | null> {
      // Better Auth handles serialization - just return the raw string
      return await kv.get(key);
    },

    async set(key: string, value: string, ttl?: number): Promise<void> {
      const options: KVNamespacePutOptions = {};

      // Better Auth passes TTL in seconds, KV expects seconds too
      // For high-security: use explicit TTL from Better Auth (matches session expiry)
      // If no TTL provided, KV stores indefinitely (relies on Better Auth's cleanup)
      if (ttl && ttl > 0) {
        options.expirationTtl = ttl;
      }

      await kv.put(key, value, options);
    },

    // TODO: this raises drizzle eslint whereas this is KV
    async delete(key: string): Promise<void> {
      await kv.delete(key);
    },
  };
}

/**
 * Create rate limit storage adapter using Durable Objects
 * Works with any DO that implements the rate limit methods
 *
 * @param doNamespace - Durable Object namespace with RateLimiterDO
 * @param debug - Enable debug logging
 */
export function createRateLimitStorage(
  doNamespace: DurableObjectNamespace<RateLimiterDO>,
  debug = false,
): RateLimitStorage {
  return {
    async get(key: string): Promise<RateLimit | undefined> {
      const start = Date.now();

      try {
        const doId = doNamespace.idFromName(key);
        const stub = doNamespace.get(doId);

        // Direct RPC method call
        const data = await stub.getRateLimit();

        if (debug && data) {
          console.log(`[RateLimit] GET ${key}: count=${data.count} (${Date.now() - start}ms)`);
        }
        else if (debug) {
          console.log(`[RateLimit] GET ${key}: NOT FOUND (${Date.now() - start}ms)`);
        }

        return data;
      }
      catch (error) {
        if (debug)
          console.error(`[RateLimit] GET ${key} ERROR:`, error);
        // Return undefined on errors to let Better Auth handle it gracefully
        return undefined;
      }
    },

    async set(key: string, value: RateLimit): Promise<void> {
      const start = Date.now();

      try {
        const doId = doNamespace.idFromName(key);
        const stub = doNamespace.get(doId);

        // Direct RPC method call
        await stub.setRateLimit(value);

        if (debug) {
          console.log(`[RateLimit] SET ${key}: count=${value.count} (${Date.now() - start}ms)`);
        }
      }
      catch (error) {
        if (debug)
          console.error(`[RateLimit] SET ${key} ERROR:`, error);
        // Re-throw to let Better Auth know the operation failed
        throw error;
      }
    },
  };
}
