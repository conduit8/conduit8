// Platform user configurations with Claude Code setup
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const platformUsers = sqliteTable('platform_users', {
  // Platform-specific user ID (e.g., Slack U123456)
  platformUserId: text('platform_user_id').primaryKey(),
  // Platform type (slack, discord, telegram)
  platform: text('platform').notNull().default('slack'),
  // Claude instance configuration
  githubToken: text('github_token').notNull(),
  anthropicKey: text('anthropic_key').notNull(),
  firecrawlKey: text('firecrawl_key'),
  // Audit timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, table => ({
  // Index for platform-based queries
  platformIdx: index('platform_users_platform_idx').on(table.platform),
  // Index for timestamp-based queries
  createdAtIdx: index('platform_users_created_at_idx').on(table.createdAt),
}));

export type PlatformUser = typeof platformUsers.$inferSelect;
export type PlatformUserInsert = typeof platformUsers.$inferInsert;
