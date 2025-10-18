import type { AppContext } from '@worker/entrypoints/api/types';

import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { Hono } from 'hono';

import { getAuth } from '@worker/infrastructure/auth/auth';
import { createDatabase } from '@worker/infrastructure/persistence/database/connection';

const authRoutes = new Hono<AppContext>();

authRoutes.on(['POST', 'GET'], '/auth/**', async (c) => {
  const db = createDatabase(c.env.D1);
  const adapter = drizzleAdapter(db, { provider: 'sqlite' });
  const auth = getAuth(adapter, c.env);
  return auth.handler(c.req.raw);
});

export default authRoutes;
