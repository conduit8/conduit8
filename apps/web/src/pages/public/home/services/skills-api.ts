import type { SkillCategory } from '@conduit8/core';

/**
 * Stubbed skills API service
 * TODO: Replace with actual API implementation using @conduit8/core contracts
 */

export interface SubmitSkillRequest {
  zipFile: File;
  category: SkillCategory;
}

export interface SubmitSkillResponse {
  success: boolean;
  skillId?: string;
  error?: string;
}

/**
 * Submit a skill for review
 * TODO: Implement actual API call
 */
async function submitSkill(request: SubmitSkillRequest): Promise<SubmitSkillResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Stub: Always succeed
  return {
    success: true,
    skillId: crypto.randomUUID(),
  };
}

export const skillsApi = {
  submitSkill,
};
