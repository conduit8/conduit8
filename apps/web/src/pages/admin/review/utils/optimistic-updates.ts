import type { ListPendingSubmissionsResponse, SubmissionStatus } from '@conduit8/core';

/**
 * API response type for admin submissions
 */
type SubmissionsResponse = ListPendingSubmissionsResponse;

/**
 * Submission item type
 */
type Submission = SubmissionsResponse['data'][number];

/**
 * Optimistically remove a submission from one status list
 * Used when approving or rejecting
 *
 * @param data - Current query data
 * @param submissionId - ID of submission to remove
 * @returns Updated data with submission removed
 */
export function removeSubmissionFromList(
  data: SubmissionsResponse | undefined,
  submissionId: string,
): SubmissionsResponse | undefined {
  if (!data) return data;

  return {
    ...data,
    data: data.data.filter(submission => submission.id !== submissionId),
  };
}

/**
 * Optimistically add a submission to a target status list
 * Used when approving or rejecting to add to approved/rejected list
 *
 * @param data - Current query data
 * @param submission - Submission to add
 * @param newStatus - New status of the submission
 * @returns Updated data with submission added
 */
export function addSubmissionToList(
  data: SubmissionsResponse | undefined,
  submission: Submission,
  newStatus: SubmissionStatus,
): SubmissionsResponse | undefined {
  if (!data) return data;

  // Update submission status
  const updatedSubmission = {
    ...submission,
    status: newStatus,
    reviewedAt: new Date(),
  };

  return {
    ...data,
    data: [updatedSubmission, ...data.data],
  };
}

/**
 * Build query key for submissions
 *
 * @param isAdmin - Whether user is admin
 * @param status - Submission status (admin only)
 * @returns Query key array
 */
export function buildSubmissionsQueryKey(
  isAdmin: boolean,
  status?: SubmissionStatus,
): (string | boolean | SubmissionStatus)[] {
  return ['submissions', isAdmin, ...(isAdmin && status ? [status] : [])];
}
