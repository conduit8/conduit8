import type {
  CheckSkillNameResponse,
  ListMySubmissionsQuery,
  ListMySubmissionsResponse,
  ListPendingSubmissionsQuery,
  ListPendingSubmissionsResponse,
  ListSkillsQuery,
  ListSkillsResponse,
  SkillCategory,
  SubmitSkillResponse,
} from '@conduit8/core';

import { getApiRoute } from '@conduit8/core';

import { api } from '@web/lib/clients/conduit8-http.client';

/**
 * Skills API service
 */

export interface SubmitSkillRequest {
  zipFile: File;
  category: SkillCategory;
}

// Alias for compatibility with hooks
export type SubmitSkillPayload = SubmitSkillRequest;

/**
 * Check if skill name is available
 */
async function checkSkillName(name: string): Promise<CheckSkillNameResponse> {
  return api.get<CheckSkillNameResponse>(getApiRoute('skill_check_name'), {
    queryParams: { name },
  });
}

/**
 * List skills
 */
async function listSkills(query: ListSkillsQuery): Promise<ListSkillsResponse> {
  return api.get<ListSkillsResponse>(getApiRoute('skills'), {
    queryParams: {
      q: query.q,
      limit: query.limit,
      offset: query.offset,
    },
  });
}

/**
 * Submit a skill for review
 */
async function submitSkill(request: SubmitSkillRequest): Promise<SubmitSkillResponse> {
  const formData = new FormData();
  formData.append('file', request.zipFile);
  formData.append('category', request.category);

  return api.post<SubmitSkillResponse>(getApiRoute('skill_submit'), formData);
}

/**
 * List current user's submissions
 */
async function listMySubmissions(query: Partial<ListMySubmissionsQuery> = {}): Promise<ListMySubmissionsResponse> {
  return api.get<ListMySubmissionsResponse>(getApiRoute('my_submissions'), {
    queryParams: {
      status: query.status,
      limit: query.limit ?? 50,
      offset: query.offset ?? 0,
    },
  });
}

/**
 * List all submissions (admin only)
 */
async function listAdminSubmissions(query: Partial<ListPendingSubmissionsQuery> = {}): Promise<ListPendingSubmissionsResponse> {
  return api.get<ListPendingSubmissionsResponse>(getApiRoute('admin_skills_submissions'), {
    queryParams: {
      status: query.status,
      limit: query.limit ?? 50,
      offset: query.offset ?? 0,
    },
  });
}

export const skillsApi = {
  checkSkillName,
  listSkills,
  submitSkill,
  listMySubmissions,
  listAdminSubmissions,
};
