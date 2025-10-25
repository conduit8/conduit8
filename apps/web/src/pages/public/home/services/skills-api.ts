import type { ListSkillsQuery, ListSkillsResponse } from '@conduit8/core';

import { getApiRoute } from '@conduit8/core';
import { api } from '@web/lib/clients';

export interface SubmitSkillPayload {
  zipFile: File; // Complete ZIP package created by frontend
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

  submit: async (payload: SubmitSkillPayload): Promise<SubmitSkillResponse> => {
    // ============================================================================
    // STUBBED FOR TESTING - TODO: Implement real backend endpoint
    // ============================================================================
    // Real implementation when backend is ready:
    /*
    const formData = new FormData();
    formData.append('zipFile', payload.zipFile);

    return api.post(getApiRoute('skills'), {
      body: formData,
      headers: {
        // Let browser set Content-Type with boundary for multipart/form-data
      },
    });
    */

    // STUB: Simulate API call with 1.5s delay
    console.log('[STUB] Submitting skill ZIP:', payload.zipFile.name, payload.zipFile.size, 'bytes');
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock successful response
    return {
      success: true,
      message: 'Skill submitted successfully! It will be reviewed shortly.',
      skillSlug: 'mock-skill-' + Date.now(),
    };
    // ============================================================================
  },
};
