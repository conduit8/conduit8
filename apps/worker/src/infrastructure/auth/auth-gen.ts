import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { createBetterAuth } from './auth';

export const auth = createBetterAuth(
  drizzleAdapter({} as any, {
    provider: 'sqlite',
  }),
);
