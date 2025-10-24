import type { ListSkillsQuery, ListSkillsResponse } from '@conduit8/core';

import { getApiRoute } from '@conduit8/core';
import { api } from '@web/lib/clients';
import type { SkillStatus } from '@web/lib/types/skill-status';

export interface SubmitSkillPayload {
  zipFile: File; // Complete skill ZIP package (created client-side)
}

export interface SubmitSkillResponse {
  success: boolean;
  message: string;
  skillSlug?: string;
}

export interface UpdateSkillMetadataPayload {
  displayName?: string;
  description?: string;
  category?: string;
  examples?: string[];
  curatorNote?: string | null;
}

export interface ApproveSkillResponse {
  success: boolean;
  message: string;
}

export interface RejectSkillResponse {
  success: boolean;
  message: string;
}

export const skillsApi = {
  list: async (query: ListSkillsQuery & { status?: SkillStatus }): Promise<ListSkillsResponse> => {
    return api.get(getApiRoute('skills'), { queryParams: query });
  },

  /**
   * Submit a skill ZIP package
   * The ZIP should contain:
   * - SKILL.md (with frontmatter: name, description, license, allowed-tools)
   * - metadata.json (author, authorKind, sourceType, sourceUrl, examples)
   * - [optional] additional files (scripts, resources, templates)
   */
  submit: async (payload: SubmitSkillPayload): Promise<SubmitSkillResponse> => {
    const formData = new FormData();
    formData.append('skill', payload.zipFile);

    return api.post(getApiRoute('skills'), {
      body: formData,
      // Let browser set Content-Type with boundary
    });
  },

  /**
   * Update skill metadata (admin only)
   */
  updateMetadata: async (slug: string, payload: UpdateSkillMetadataPayload): Promise<SubmitSkillResponse> => {
    return api.patch(`${getApiRoute('skills')}/${slug}`, {
      body: payload,
    });
  },

  /**
   * Approve a pending skill (admin only)
   */
  approve: async (slug: string): Promise<ApproveSkillResponse> => {
    return api.post(`${getApiRoute('skills')}/${slug}/approve`, {});
  },

  /**
   * Reject a pending skill (admin only)
   */
  reject: async (slug: string): Promise<RejectSkillResponse> => {
    return api.post(`${getApiRoute('skills')}/${slug}/reject`, {});
  },
};
