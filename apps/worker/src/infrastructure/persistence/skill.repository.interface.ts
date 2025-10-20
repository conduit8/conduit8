import type { Skill } from './database/schema/skills';

export interface ISkillRepository {
  findById: (skillId: string) => Promise<Skill | null>;
  findBySlug: (slug: string) => Promise<Skill | null>;
  getDownloadCount: (skillId: string) => Promise<number>;
  incrementDownloadCount: (skillId: string) => Promise<void>;
}
