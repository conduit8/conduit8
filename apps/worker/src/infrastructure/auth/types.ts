import type { getAuth } from '@worker/infrastructure/auth';
import type { InferSelectModel } from 'drizzle-orm';

import type {
  user,
} from '@worker/infrastructure/persistence/database/schema/auth.ts';

// Extract types from Better Auth using $Infer from local auth config
type Auth = ReturnType<typeof getAuth>;
export type Session = Auth['$Infer']['Session'];
export type User = Auth['$Infer']['Session']['user'];

// Full database user type (includes all fields like stripeCustomerId)
export type DbUser = InferSelectModel<typeof user>;
