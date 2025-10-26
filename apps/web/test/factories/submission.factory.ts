import type { ListPendingSubmissionsResponse, SubmissionStatus } from '@conduit8/core';

import { SUBMISSION_STATUS } from '@conduit8/core';

type Submission = ListPendingSubmissionsResponse['data'][number];

/**
 * Create a mock submission for testing
 */
export function createSubmission(overrides?: Partial<Submission>): Submission {
  return {
    id: crypto.randomUUID(),
    slug: 'test-skill',
    name: 'Test Skill',
    description: 'Test description',
    category: 'development',
    status: SUBMISSION_STATUS.PENDING_REVIEW,
    submittedAt: new Date().toISOString(),
    reviewedAt: null,
    rejectionReason: null,
    submittedBy: {
      id: crypto.randomUUID(),
      email: 'user@example.com',
      name: 'Test User',
    },
    ...overrides,
  };
}

/**
 * Create a mock submissions response for testing
 */
export function createSubmissionsResponse(
  submissions: Submission[] = [],
): ListPendingSubmissionsResponse {
  return {
    success: true,
    data: submissions,
  };
}

/**
 * Create multiple submissions with sequential IDs
 */
export function createSubmissions(
  count: number,
  status?: SubmissionStatus,
): Submission[] {
  return Array.from({ length: count }, (_, i) => createSubmission({
    id: `test-id-${i + 1}`,
    slug: `test-skill-${i + 1}`,
    name: `Test Skill ${i + 1}`,
    description: `Description ${i + 1}`,
    status: status ?? SUBMISSION_STATUS.PENDING_REVIEW,
    submittedBy: {
      id: `user-${i + 1}`,
      email: `user${i + 1}@example.com`,
      name: `User ${i + 1}`,
    },
  }));
}
