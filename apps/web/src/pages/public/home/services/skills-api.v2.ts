import type { ListSkillsQuery, ListSkillsResponse } from '@conduit8/core';

import { getApiRoute } from '@conduit8/core';
import { api } from '@web/lib/clients';

export interface SubmitSkillPayload {
  zipFile: File; // Complete skill ZIP package (created client-side)
}

export interface SubmitSkillResponse {
  success: boolean;
  message: string;
  skillSlug?: string;
}

export const skillsApi = {
  list: async (query: ListSkillsQuery): Promise<ListSkillsResponse> => {
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
};
