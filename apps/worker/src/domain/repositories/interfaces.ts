import type { Skill } from '@worker/infrastructure/persistence/database/schema/skills';

export type SkillWithStats = Skill & { downloadCount: number };

export interface ISkillRepository {
  findById: (skillId: string) => Promise<Skill | null>;
  findBySlug: (slug: string) => Promise<Skill | null>;
  findAll: (query?: string, limit?: number, offset?: number) => Promise<SkillWithStats[]>;
  getDownloadCount: (skillId: string) => Promise<number>;
  incrementDownloadCount: (skillId: string) => Promise<void>;
}
