import type { SubmissionStatus } from '@conduit8/core';

/**
 * UI mappings for submission statuses
 * Domain types come from @conduit8/core
 */

export const SKILL_STATUS_LABELS: Record<SubmissionStatus, string> = {
  pending_review: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
};

export const SKILL_STATUS_COLORS: Record<SubmissionStatus, string> = {
  pending_review: 'warning',
  approved: 'success',
  rejected: 'destructive',
};
