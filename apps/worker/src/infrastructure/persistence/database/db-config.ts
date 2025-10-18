import type { DrizzleConfig } from 'drizzle-orm';

import * as schema from './schema';

// Configuration setup
export const config = {
  casing: 'snake_case',
  logger: false,
  schema,
} satisfies DrizzleConfig<typeof schema>;
