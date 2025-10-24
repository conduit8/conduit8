import type { ListSkillsQuery, ListSkillsResponse } from '@conduit8/core';

import { getApiRoute } from '@conduit8/core';
import { api } from '@web/lib/clients';

export interface SubmitSkillPayload {
  displayName: string;
  description: string;
  category: string;
  allowedTools: string[];
  examples: string[];
  zipFile: File;
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
    const formData = new FormData();
    formData.append('displayName', payload.displayName);
    formData.append('description', payload.description);
    formData.append('category', payload.category);
    formData.append('allowedTools', JSON.stringify(payload.allowedTools));
    formData.append('examples', JSON.stringify(payload.examples));
    formData.append('zipFile', payload.zipFile);

    return api.post(getApiRoute('skills'), {
      body: formData,
      headers: {
        // Let the browser set Content-Type with boundary for multipart/form-data
      },
    });
  },
};
