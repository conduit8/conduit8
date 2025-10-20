import { skills, skillStats } from '@worker/infrastructure/persistence/database/schema';
import { eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';

import type { Skill } from '@worker/infrastructure/persistence/database/schema/skills';
import type { ISkillRepository } from '@worker/infrastructure/persistence/skill.repository.interface';

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
