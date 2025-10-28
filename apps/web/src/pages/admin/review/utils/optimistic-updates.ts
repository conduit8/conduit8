import type { ListAdminSubmissionsResponse, SubmissionListItem, SubmissionStatus } from '@conduit8/core';

/**
 * Optimistically remove a submission from one status list
 * Used when approving or rejecting
 */
export function removeSubmissionFromList(
  data: ListAdminSubmissionsResponse | undefined,
  submissionId: string,
): ListAdminSubmissionsResponse | undefined {
  if (!data)
    return data;

  return {
    ...data,
    data: data.data.filter(submission => submission.id !== submissionId),
  };
}

/**
 * Optimistically add a submission to a target status list
 * Used when approving or rejecting to add to approved/rejected list
 */
export function addSubmissionToList(
  data: ListAdminSubmissionsResponse | undefined,
  submission: SubmissionListItem,
  newStatus: SubmissionStatus,
): ListAdminSubmissionsResponse | undefined {
  if (!data)
    return data;

  const updatedSubmission: SubmissionListItem = {
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
