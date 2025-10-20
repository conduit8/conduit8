import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const skills = sqliteTable('skills', {
  id: text('id').primaryKey(), // UUID
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),

  // Storage pointers
  zipKey: text('zip_key').notNull(),
  imageKey: text('image_key').notNull(),

  // Content (stored as JSON text)
  examples: text('examples', { mode: 'json' }).$type<string[]>().notNull(),
  curatorNote: text('curator_note'),

  // Attribution
  author: text('author').notNull(),
  authorKind: text('author_kind', { enum: ['verified', 'community'] }).notNull(),

  // Source
  sourceType: text('source_type', { enum: ['import', 'pr', 'submission'] }).notNull(),
  sourceUrl: text('source_url'),

  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

export const skillStats = sqliteTable('skill_stats', {
  skillId: text('skill_id')
    .primaryKey()
    .references(() => skills.id, { onDelete: 'cascade' }),
  downloadCount: integer('download_count').default(0).notNull(),
});

// Type exports
export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;
export type SkillStats = typeof skillStats.$inferSelect;
export type NewSkillStats = typeof skillStats.$inferInsert;
