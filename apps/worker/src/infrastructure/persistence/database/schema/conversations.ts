import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const conversations = sqliteTable('conversations', {
  // Internal conversation UUID
  id: text('id').primaryKey(),
  // Platform-specific user ID (e.g., Slack U123456)
  platformUserId: text('platform_user_id').notNull(),
  // Platform-specific context as JSON (e.g., {platform: 'slack', channel: 'D123', threadTs: '123.456'})
  platformContext: text('platform_context').notNull(), // JSON
  // Claude session ID (set after first response)
  claudeSessionId: text('claude_session_id'),
  // Audit timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, table => ({
  // Index for fast lookups by user and platform context
  lookupIdx: index('conversations_lookup_idx').on(table.platformUserId, table.platformContext),
  // Index for finding conversations by session ID
  sessionIdx: index('conversations_session_idx').on(table.claudeSessionId),
  // Index for timestamp-based queries
  createdAtIdx: index('conversations_created_at_idx').on(table.createdAt),
}));

export type ConversationSelect = typeof conversations.$inferSelect;
export type ConversationInsert = typeof conversations.$inferInsert;
