import type { ApproveSubmissionRequest, ListPendingSubmissionsResponse, RejectSubmissionRequest } from '@conduit8/core';

import { SUBMISSION_STATUS } from '@conduit8/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  addSubmissionToList,
  buildSubmissionsQueryKey,
  removeSubmissionFromList,
} from '@web/pages/admin/review/utils/optimistic-updates';
import { skillsApi } from '@web/pages/public/home/services/skills-api';

type SubmissionsResponse = ListPendingSubmissionsResponse;

/**
 * Hook to approve a skill submission
 * Uses optimistic updates to remove from pending and add to approved
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

    onMutate: async ({ submissionId }) => {
      // Build query keys
      const pendingKey = buildSubmissionsQueryKey(true, SUBMISSION_STATUS.PENDING_REVIEW);
      const approvedKey = buildSubmissionsQueryKey(true, SUBMISSION_STATUS.APPROVED);

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['submissions'] });

      // Snapshot previous values
      const previousPending = queryClient.getQueryData<SubmissionsResponse>(pendingKey);
      const previousApproved = queryClient.getQueryData<SubmissionsResponse>(approvedKey);

      // Find the submission being approved
      const submission = previousPending?.data.find(s => s.id === submissionId);

      // Optimistically remove from pending list
      queryClient.setQueryData<SubmissionsResponse>(
        pendingKey,
        old => removeSubmissionFromList(old, submissionId),
      );

      // Optimistically add to approved list (if we found the submission)
      if (submission) {
        queryClient.setQueryData<SubmissionsResponse>(
          approvedKey,
          old => addSubmissionToList(old, submission, SUBMISSION_STATUS.APPROVED),
        );
      }

      return { previousPending, previousApproved, submission };
    },

    onSuccess: () => {
      // Invalidate all submission queries to refetch
      queryClient.invalidateQueries({ queryKey: ['submissions'] });

      toast.success('Skill approved successfully');
    },

    onError: (_error, _variables, context) => {
      // Rollback on error
      const pendingKey = buildSubmissionsQueryKey(true, SUBMISSION_STATUS.PENDING_REVIEW);
      const approvedKey = buildSubmissionsQueryKey(true, SUBMISSION_STATUS.APPROVED);

      if (context?.previousPending) {
        queryClient.setQueryData(pendingKey, context.previousPending);
      }
      if (context?.previousApproved) {
        queryClient.setQueryData(approvedKey, context.previousApproved);
      }

      toast.error('Failed to approve skill');
    },
  });
}

/**
 * Hook to reject a skill submission
 * Uses optimistic updates to remove from pending and add to rejected
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

    onMutate: async ({ submissionId }) => {
      // Build query keys
      const pendingKey = buildSubmissionsQueryKey(true, SUBMISSION_STATUS.PENDING_REVIEW);
      const rejectedKey = buildSubmissionsQueryKey(true, SUBMISSION_STATUS.REJECTED);

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['submissions'] });

      // Snapshot previous values
      const previousPending = queryClient.getQueryData<SubmissionsResponse>(pendingKey);
      const previousRejected = queryClient.getQueryData<SubmissionsResponse>(rejectedKey);

      // Find the submission being rejected
      const submission = previousPending?.data.find(s => s.id === submissionId);

      // Optimistically remove from pending list
      queryClient.setQueryData<SubmissionsResponse>(
        pendingKey,
        old => removeSubmissionFromList(old, submissionId),
      );

      // Optimistically add to rejected list (if we found the submission)
      if (submission) {
        queryClient.setQueryData<SubmissionsResponse>(
          rejectedKey,
          old => addSubmissionToList(old, submission, SUBMISSION_STATUS.REJECTED),
        );
      }

      return { previousPending, previousRejected, submission };
    },

    onSuccess: () => {
      // Invalidate all submission queries to refetch
      queryClient.invalidateQueries({ queryKey: ['submissions'] });

      toast.success('Skill rejected successfully');
    },

    onError: (_error, _variables, context) => {
      // Rollback on error
      const pendingKey = buildSubmissionsQueryKey(true, SUBMISSION_STATUS.PENDING_REVIEW);
      const rejectedKey = buildSubmissionsQueryKey(true, SUBMISSION_STATUS.REJECTED);

      if (context?.previousPending) {
        queryClient.setQueryData(pendingKey, context.previousPending);
      }
      if (context?.previousRejected) {
        queryClient.setQueryData(rejectedKey, context.previousRejected);
      }

      toast.error('Failed to reject skill');
    },
  });
}
