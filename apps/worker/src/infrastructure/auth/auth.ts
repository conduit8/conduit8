import type { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { betterAuth } from 'better-auth';

import { createBetterAuthOptions } from './options.ts';

/**
 * Create Better Auth instance for CLI schema generation
 * @param database - Drizzle database instance (can be dummy for CLI)
 * @param env - Optional environment variables (undefined in CLI mode)
 */
export function createBetterAuth(
  database: Parameters<typeof drizzleAdapter>[0],
  env?: Env,
): ReturnType<typeof betterAuth> {
  return betterAuth({
    database,
    ...createBetterAuthOptions(database, env),
  });
}

/**
 * Create Better Auth instance for runtime use
 * @param database - Drizzle database instance from createDatabase()
 * @param env - Cloudflare Worker environment bindings
 */
export function getAuth(
  database: Parameters<typeof drizzleAdapter>[0],
  env: Env,
): ReturnType<typeof betterAuth> {
  return betterAuth({
    database,
    ...createBetterAuthOptions(database, env),
  });
}
