import type * as schema from '@worker/infrastructure/persistence/database/schema';
import type { DrizzleD1Database } from 'drizzle-orm/d1';

export type DrizzleDb = DrizzleD1Database<typeof schema>;
