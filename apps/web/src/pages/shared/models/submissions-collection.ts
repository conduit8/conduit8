import type { ListSubmissionsResponse } from '@conduit8/core';

type Submission = ListSubmissionsResponse['data'][number];

/**
 * Domain model for submissions collection
 * Encapsulates count logic for different submission statuses
 */
export class SubmissionsCollection {
  constructor(private readonly submissions: Submission[]) {}

  get pendingCount(): number {
    return this.submissions.filter(s => s.status === 'pending_review').length;
  }

  get approvedCount(): number {
    return this.submissions.filter(s => s.status === 'approved').length;
  }

  get rejectedCount(): number {
    return this.submissions.filter(s => s.status === 'rejected').length;
  }

  get total(): number {
    return this.submissions.length;
  }

  get items(): Submission[] {
    return this.submissions;
  }
}
