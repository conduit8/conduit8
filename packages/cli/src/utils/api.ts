import { DUMMY_SKILLS } from './config.js';

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  author: string;
  authorKind: 'official' | 'community';
  zipSize: number;
  downloadCount: number;
  examples: string[];
}

/**
 * Get skill by ID
 * STUB: Returns dummy data instead of real API call
 */
export async function getSkill(id: string): Promise<Skill> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const skill = DUMMY_SKILLS.find(s => s.id === id);

  if (!skill) {
    throw new Error(`Skill '${id}' not found in registry`);
  }

  return skill;
}

/**
 * Search skills by query
 * STUB: Filters dummy data instead of real API call
 */
export async function searchSkills(query?: string): Promise<Skill[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));

  if (!query) {
    return DUMMY_SKILLS;
  }

  const lowerQuery = query.toLowerCase();
  return DUMMY_SKILLS.filter(skill =>
    skill.name.toLowerCase().includes(lowerQuery)
    || skill.description.toLowerCase().includes(lowerQuery)
    || skill.id.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Track skill download
 * STUB: No-op for now
 */
export async function trackDownload(id: string): Promise<void> {
  // Fire and forget - silently succeed
  return Promise.resolve();
}
