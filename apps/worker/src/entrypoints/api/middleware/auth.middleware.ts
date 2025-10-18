import type { AppContext } from '@worker/entrypoints/api/types';
import type { Context, Next } from 'hono';

import * as Sentry from '@sentry/cloudflare';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';

import type { User } from '@worker/infrastructure/auth/types';

import { getAuth } from '@worker/infrastructure/auth/auth';
import { createDatabase } from '@worker/infrastructure/persistence/database/connection';

interface AuthContext {
  Variables: AppContext['Variables'] & {
    user: User; // Non-optional - this middleware guarantees it exists
  };
  Bindings: AppContext['Bindings'];
}

/**
 * Extracts auth session if present (skips /auth/* routes)
 * Sets user in context
 */
export async function extractAuth(c: Context<AppContext>, next: Next) {
  // Skip auth extraction for Better Auth routes
  if (c.req.path.startsWith('/auth/')) {
    return next();
  }

  try {
    const db = createDatabase(c.env.D1);
    const adapter = drizzleAdapter(db, {
      provider: 'sqlite',
    });
    const auth = getAuth(adapter, c.env);

    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (session?.user) {
      c.set('user', session.user);
      Sentry.setUser({
        id: session.user.id,
        email: session.user.email,
      });
    }
  }
  catch (error) {
    console.error('[Auth Middleware] Error extracting session:', error);
  }

  await next();
}

/**
 * Requires authentication - returns 401 if not authenticated
 */
export const requireAuth = createMiddleware<AuthContext>(async (c, next) => {
  if (!c.get('user')) {
    throw new HTTPException(401, { message: 'Unauthorized' });
  }

  await next();
});
