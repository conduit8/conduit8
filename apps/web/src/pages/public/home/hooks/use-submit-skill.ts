import type { SubmitSkillResponse } from '@conduit8/core';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { SubmitSkillPayload } from '../services/skills-api';

import { skillsApi } from '../services/skills-api';

/**
 * Hook to submit a skill
 * Uses React Query mutation for optimistic updates and error handling
 */
export function useSubmitSkill() {
  const queryClient = useQueryClient();

  return useMutation<SubmitSkillResponse, Error, SubmitSkillPayload>({
    mutationFn: (payload: SubmitSkillPayload) => skillsApi.submitSkill(payload),

    onSuccess: (data) => {
      // Invalidate skills list to refetch with new skill
      queryClient.invalidateQueries({ queryKey: ['skills'] });

      // Show success toast
      toast.success('Skill submitted successfully', {
        description: data.message,
      });
    },

    onError: (error) => {
      // Show error toast
      toast.error('Failed to submit skill', {
        description: error.message,
      });
    },
  });
}
