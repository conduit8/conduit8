import type { SubmissionStatus, UpdateSubmissionRequest } from '@conduit8/core';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { skillsApi } from '@web/pages/public/home/services/skills-api';

/**
 * Hook to update skill submission fields (category, author, sourceType, etc.)
 * Invalidates queries to trigger re-fetch on success
 */
export function useUpdateSubmission(submissionId: string, _currentStatus: SubmissionStatus) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: UpdateSubmissionRequest) => {
      return skillsApi.updateSubmission(submissionId, updates);
    },

    onSuccess: () => {
      // Invalidate submission list queries to trigger re-fetch
      queryClient.invalidateQueries({ queryKey: ['submissions'] });

      // Invalidate individual submission query if it exists
      queryClient.invalidateQueries({ queryKey: ['submission', submissionId] });

      toast.success('Submission updated');
    },

    onError: () => {
      toast.error('Failed to update submission');
    },
  });
}
