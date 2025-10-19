import type { Skill, SkillStats } from './database/schema/skills';

export interface ISkillRepository {
  findById(skillId: string): Promise<Skill | null>;
  getDownloadCount(skillId: string): Promise<number>;
}
