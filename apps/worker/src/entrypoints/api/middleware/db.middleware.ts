import type { AppContext } from '@worker/entrypoints/api/types';
import type { DrizzleDb } from '@worker/infrastructure/persistence/database/types';

import { createMiddleware } from 'hono/factory';

import { createDatabase } from '@worker/infrastructure/persistence/database/connection';

interface DatabaseContext {
  Variables: AppContext['Variables'] & {
    db: DrizzleDb;
  };
  Bindings: AppContext['Bindings'];
}

export const withDatabase = createMiddleware<DatabaseContext>(async (c, next) => {
  const db = createDatabase(c.env.D1);
  c.set('db', db);
  await next();
});
