import type { ApproveSubmissionRequest, RejectSubmissionRequest } from '@conduit8/core';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { skillsApi } from '@web/pages/public/home/services/skills-api';

/**
 * Hook to approve a skill submission
 * Invalidates queries to trigger re-fetch on success
 */
export function useApproveSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      submissionId,
      request,
    }: {
      submissionId: string;
      request?: ApproveSubmissionRequest;
    }) => skillsApi.approveSubmission(submissionId, request),

    onSuccess: () => {
      // Invalidate submission queries to trigger re-fetch
      queryClient.invalidateQueries({ queryKey: ['submissions'] });

      // Invalidate skills queries to refresh home page
      queryClient.invalidateQueries({ queryKey: ['skills'] });

      toast.success('Skill approved successfully');
    },

    onError: () => {
      toast.error('Failed to approve skill');
    },
  });
}

/**
 * Hook to reject a skill submission
 * Invalidates queries to trigger re-fetch on success
 */
export function useRejectSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      submissionId,
      request,
    }: {
      submissionId: string;
      request: RejectSubmissionRequest;
    }) => skillsApi.rejectSubmission(submissionId, request),

    onSuccess: () => {
      // Invalidate submission queries to trigger re-fetch
      queryClient.invalidateQueries({ queryKey: ['submissions'] });

      toast.success('Skill rejected successfully');
    },

    onError: () => {
      toast.error('Failed to reject skill');
    },
  });
}
