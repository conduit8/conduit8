import { skills, skillStats } from '@worker/infrastructure/persistence/database/schema';
import { desc, eq, like, or, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';

import type { Skill } from '@worker/infrastructure/persistence/database/schema/skills';
import type { ISkillRepository, SkillWithStats } from '@worker/infrastructure/persistence/skill.repository.interface';

import { DatabaseError } from '@worker/infrastructure/errors/infrastructure.errors';

export class SkillRepository implements ISkillRepository {
  constructor(private d1: D1Database) {}

  async findById(skillId: string): Promise<Skill | null> {
    try {
      const db = drizzle(this.d1);

      const result = await db
        .select()
        .from(skills)
        .where(eq(skills.id, skillId))
        .get();

      return result ?? null;
    }
    catch (error) {
      throw new DatabaseError('Failed to fetch skill by ID', error);
    }
  }

  async findBySlug(slug: string): Promise<Skill | null> {
    try {
      const db = drizzle(this.d1);

      const result = await db
        .select()
        .from(skills)
        .where(eq(skills.slug, slug))
        .get();

      return result ?? null;
    }
    catch (error) {
      throw new DatabaseError('Failed to fetch skill by slug', error);
    }
  }

  async findAll(query?: string, limit = 50, offset = 0): Promise<SkillWithStats[]> {
    try {
      const db = drizzle(this.d1);

      let dbQuery = db
        .select({
          id: skills.id,
          slug: skills.slug,
          name: skills.name,
          description: skills.description,
          category: skills.category,
          zipKey: skills.zipKey,
          imageKey: skills.imageKey,
          examples: skills.examples,
          curatorNote: skills.curatorNote,
          author: skills.author,
          authorKind: skills.authorKind,
          sourceType: skills.sourceType,
          sourceUrl: skills.sourceUrl,
          createdAt: skills.createdAt,
          updatedAt: skills.updatedAt,
          downloadCount: skillStats.downloadCount,
        })
        .from(skills)
        .leftJoin(skillStats, eq(skills.id, skillStats.skillId))
        .$dynamic();

      // Apply search filter if query provided
      if (query) {
        const searchPattern = `%${query}%`;
        dbQuery = dbQuery.where(
          or(
            like(skills.name, searchPattern),
            like(skills.description, searchPattern),
          ),
        );
      }

      // Order by download count (popular first), then by created date
      const results = await dbQuery
        .orderBy(desc(skillStats.downloadCount), desc(skills.createdAt))
        .limit(limit)
        .offset(offset)
        .all();

      return results.map(row => ({
        id: row.id,
        slug: row.slug,
        name: row.name,
        description: row.description,
        category: row.category,
        zipKey: row.zipKey,
        imageKey: row.imageKey,
        examples: row.examples,
        curatorNote: row.curatorNote,
        author: row.author,
        authorKind: row.authorKind,
        sourceType: row.sourceType,
        sourceUrl: row.sourceUrl,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        downloadCount: row.downloadCount ?? 0,
      }));
    }
    catch (error) {
      throw new DatabaseError('Failed to fetch skills', error);
    }
  }

  async getDownloadCount(skillId: string): Promise<number> {
    try {
      const db = drizzle(this.d1);

      const result = await db
        .select()
        .from(skillStats)
        .where(eq(skillStats.skillId, skillId))
        .get();

      return result?.downloadCount ?? 0;
    }
    catch (error) {
      throw new DatabaseError('Failed to fetch skill download count', error);
    }
  }

  async incrementDownloadCount(skillId: string): Promise<void> {
    try {
      const db = drizzle(this.d1);

      await db
        .insert(skillStats)
        .values({ skillId, downloadCount: 1 })
        .onConflictDoUpdate({
          target: skillStats.skillId,
          set: { downloadCount: sql`${skillStats.downloadCount} + 1` },
        })
        .run();
    }
    catch (error) {
      throw new DatabaseError('Failed to increment download count', error);
    }
  }
}
