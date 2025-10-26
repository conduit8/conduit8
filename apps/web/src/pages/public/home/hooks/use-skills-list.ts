import type { ListSkillsQuery } from '@conduit8/core';

import { useQuery } from '@tanstack/react-query';

import { skillsApi } from '../services/skills-api';

export function useSkillsList(query: ListSkillsQuery) {
  return useQuery({
    queryKey: ['skills', query],
    queryFn: () => skillsApi.listSkills(query),
  });
}
