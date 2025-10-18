import type { DrizzleD1Database } from 'drizzle-orm/d1';

import { drizzle } from 'drizzle-orm/d1';

import type * as schema from './schema';

import { config } from './db-config';

export type DatabaseConnection = DrizzleD1Database<typeof schema>;

export function createDatabase(d1: D1Database): DatabaseConnection {
  return drizzle(d1, config);
}
