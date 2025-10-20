import type { ListSkillsQuery, ListSkillsResponse } from '@conduit8/core';

import { getApiRoute } from '@conduit8/core';
import { api } from '@web/lib/clients';

export const skillsApi = {
  list: async (query: ListSkillsQuery): Promise<ListSkillsResponse> => {
    return api.get(getApiRoute('skills'), { queryParams: query });
  },
};
