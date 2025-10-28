import type { ListPendingSubmissionsResponse, SkillCategory, SubmissionStatus, UpdateSubmissionRequest } from '@conduit8/core';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { buildSubmissionsQueryKey } from '@web/pages/admin/review/utils/optimistic-updates';
import { skillsApi } from '@web/pages/public/home/services/skills-api';

type SubmissionsResponse = ListPendingSubmissionsResponse;

/**
 * Hook to update a skill submission category
 * Updates the single submission in cache on success
 */
export function useUpdateSubmissionCategory(submissionId: string, currentStatus: SubmissionStatus) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (category: SkillCategory) => {
      const request: UpdateSubmissionRequest = { category };
      return skillsApi.updateSubmission(submissionId, request);
    },

    onSuccess: (response) => {
      // Build query key for current status
      const queryKey = buildSubmissionsQueryKey(true, currentStatus);

      // Update the single submission in the cache
      queryClient.setQueryData<SubmissionsResponse>(queryKey, (old) => {
        if (!old)
          return old;

        return {
          ...old,
          data: old.data.map(submission =>
            submission.id === submissionId
              ? { ...submission, category: response.data.category }
              : submission,
          ),
        };
      });

      toast.success('Category updated');
    },

    onError: () => {
      toast.error('Failed to update category');
    },
  });
}
