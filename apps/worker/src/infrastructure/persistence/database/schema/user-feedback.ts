// User feedback collection schema
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const userFeedback = sqliteTable('user_feedback', {
  id: text('id').primaryKey(),

  // Core feedback data
  message: text('message').notNull(),
  feedbackType: text('feedback_type'), // 'bug' or 'feature'
  followUpEmail: text('follow_up_email'),

  // Metadata
  platformUserId: text('platform_user_id').notNull(),
  teamId: text('team_id').notNull(),
  platform: text('platform').notNull().default('slack'),

  // Timestamp
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, table => ({
  userIdx: index('feedback_user_idx').on(table.platformUserId),
  teamIdx: index('feedback_team_idx').on(table.teamId),
  typeIdx: index('feedback_type_idx').on(table.feedbackType),
  createdAtIdx: index('feedback_created_at_idx').on(table.createdAt),
}));
