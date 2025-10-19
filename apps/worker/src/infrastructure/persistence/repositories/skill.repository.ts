import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';

import type { Skill } from '@worker/infrastructure/persistence/database/schema/skills';
import type { ISkillRepository } from '@worker/infrastructure/persistence/skill.repository.interface';

import { DatabaseError } from '@worker/infrastructure/errors/infrastructure.errors';
import { skills, skillStats } from '@worker/infrastructure/persistence/database/schema';

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
}
