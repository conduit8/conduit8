import type { AppContext } from '@worker/entrypoints/api/types';

import { APP_ROUTES, imageProxyRequestSchema } from '@conduit8/core';
import { onError, validate } from '@worker/entrypoints/api/utils';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

const app = new Hono<AppContext>().basePath(APP_ROUTES.api.prefix);

// Constants
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB for avatars
const CACHE_TTL = 7 * 24 * 60 * 60; // 7 days in seconds
const ALLOWED_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Helper to generate cache key using crypto
async function getCacheKey(url: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(url);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `avatar:${hashHex}`;
}

app.get(
  APP_ROUTES.api.paths.imageProxy,
  validate('query', imageProxyRequestSchema, onError),
  async (c) => {
    const { url } = c.req.valid('query');
    const cacheKey = await getCacheKey(url);

    // Check cache first
    const cachedData = await c.env.KV.getWithMetadata<{ contentType: string }>(cacheKey, {
      type: 'arrayBuffer',
    });

    if (cachedData.value) {
    // Return cached image
      return new Response(cachedData.value, {
        headers: {
          'Content-Type': cachedData.metadata?.contentType || 'image/jpeg',
          'Content-Length': cachedData.value.byteLength.toString(),
          'Cache-Control': 'public, max-age=86400', // 1 day browser cache
          'X-Cache': 'HIT',
        },
      });
    }

    // Fetch from origin
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Conduit8-Avatar-Proxy/1.0',
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        console.error('[Avatar Proxy] Origin returned:', response.status, response.statusText);
        throw new HTTPException(502, {
          message: 'Failed to load avatar',
        });
      }

      const contentType = response.headers.get('content-type') ?? 'image/jpeg';

      // Validate content type
      if (!ALLOWED_CONTENT_TYPES.includes(contentType.split(';')[0]!)) {
        console.error('[Avatar Proxy] Invalid content type:', contentType);
        throw new HTTPException(415, {
          message: 'Invalid image format',
        });
      }

      // Get content length
      const contentLength = response.headers.get('content-length');
      if (contentLength && Number.parseInt(contentLength) > MAX_IMAGE_SIZE) {
        console.error(
          '[Avatar Proxy] Image too large:',
          contentLength,
          'bytes (max:',
          MAX_IMAGE_SIZE,
          ')',
        );
        throw new HTTPException(413, {
          message: 'Image too large',
        });
      }

      // Read image data
      const imageBuffer = await response.arrayBuffer();

      // Check actual size
      if (imageBuffer.byteLength > MAX_IMAGE_SIZE) {
        console.error(
          '[Avatar Proxy] Image too large after download:',
          imageBuffer.byteLength,
          'bytes (max:',
          MAX_IMAGE_SIZE,
          ')',
        );
        throw new HTTPException(413, {
          message: 'Image too large',
        });
      }

      // Store in cache with content type metadata
      await c.env.KV.put(cacheKey, imageBuffer, {
        expirationTtl: CACHE_TTL,
        metadata: { contentType },
      });

      // Return the image
      return new Response(imageBuffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Length': imageBuffer.byteLength.toString(),
          'Cache-Control': 'public, max-age=86400', // 1 day browser cache
          'X-Cache': 'MISS',
        },
      });
    }
    catch (error) {
    // If it's already an HTTPException, re-throw
      if (error instanceof HTTPException) {
        throw error;
      }

      // Otherwise, it's a fetch error
      console.error('[Avatar Proxy] Fetch error:', error);
      throw new HTTPException(502, {
        message: 'Failed to load avatar',
      });
    }
  },
);

export default app;
