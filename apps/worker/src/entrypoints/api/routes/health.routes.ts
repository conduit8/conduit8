import type { AppContext } from '@worker/entrypoints/api/types';

import { APP_ROUTES } from '@conduit8/core';
import { Hono } from 'hono';

const app = new Hono<AppContext>().basePath(APP_ROUTES.api.prefix);

/**
 * Health check endpoint
 * GET /api/v1/health
 */
app.get(APP_ROUTES.api.paths.health, async (c) => {
  const metadata = c.env.CF_VERSION_METADATA;

  return c.json({
    success: true,
    data: {
      status: 'healthy',
      version: {
        id: metadata?.id || 'local-dev',
        tag: metadata?.tag || null, // null if you don't tag releases
        timestamp: metadata?.timestamp || new Date().toISOString(),
        environment: c.env.ENV,
      },
    },
  });
});

export default app;
