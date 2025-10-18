import { applyD1Migrations, env } from 'cloudflare:test';

// Apply D1 migrations for integration tests
// This runs before tests and applies any un-applied migrations
// Safe to call multiple times - only applies new migrations
await applyD1Migrations(env.D1, env.TEST_MIGRATIONS);
