import { describe, expect, it } from 'vitest';

import { SUBMISSION_STATUS } from '@conduit8/core';

import {
  createSubmission,
  createSubmissions,
  createSubmissionsResponse,
} from '../factories/submission.factory';

import {
  addSubmissionToList,
  buildSubmissionsQueryKey,
  removeSubmissionFromList,
} from '@web/pages/admin/review/utils/optimistic-updates';

describe('optimistic-updates', () => {
  describe('removeSubmissionFromList', () => {
    it('removes submission from list by ID', () => {
      const submissions = createSubmissions(2);
      const data = createSubmissionsResponse(submissions);

      const result = removeSubmissionFromList(data, submissions[0]!.id);

      expect(result?.data).toHaveLength(1);
      expect(result?.data[0]?.id).toBe(submissions[1]!.id);
    });

    it('returns undefined when data is undefined', () => {
      const result = removeSubmissionFromList(undefined, 'test-id-1');
      expect(result).toBeUndefined();
    });

    it('returns same data when submission not found', () => {
      const submissions = createSubmissions(1);
      const data = createSubmissionsResponse(submissions);

      const result = removeSubmissionFromList(data, 'non-existent');
      expect(result?.data).toHaveLength(1);
    });
  });

  describe('addSubmissionToList', () => {
    it('adds submission to beginning of list with updated status', () => {
      const newSubmission = createSubmission({
        id: 'test-id-3',
        status: SUBMISSION_STATUS.PENDING_REVIEW,
      });

      const existingSubmissions = createSubmissions(1, SUBMISSION_STATUS.APPROVED);
      const data = createSubmissionsResponse(existingSubmissions);

      const result = addSubmissionToList(data, newSubmission, SUBMISSION_STATUS.APPROVED);

      expect(result?.data).toHaveLength(2);
      expect(result?.data[0]?.id).toBe('test-id-3');
      expect(result?.data[0]?.status).toBe(SUBMISSION_STATUS.APPROVED);
      expect(result?.data[0]?.reviewedAt).toBeTruthy();
    });

    it('returns undefined when data is undefined', () => {
      const submission = createSubmission();
      const result = addSubmissionToList(undefined, submission, SUBMISSION_STATUS.APPROVED);
      expect(result).toBeUndefined();
    });

    it('adds to empty list', () => {
      const submission = createSubmission({ id: 'test-id-1' });
      const data = createSubmissionsResponse([]);

      const result = addSubmissionToList(data, submission, SUBMISSION_STATUS.REJECTED);

      expect(result?.data).toHaveLength(1);
      expect(result?.data[0]?.id).toBe('test-id-1');
      expect(result?.data[0]?.status).toBe(SUBMISSION_STATUS.REJECTED);
    });
  });

  describe('buildSubmissionsQueryKey', () => {
    it('builds query key for admin with status', () => {
      const result = buildSubmissionsQueryKey(true, SUBMISSION_STATUS.PENDING_REVIEW);
      expect(result).toEqual(['submissions', true, SUBMISSION_STATUS.PENDING_REVIEW]);
    });

    it('builds query key for admin without status', () => {
      const result = buildSubmissionsQueryKey(true);
      expect(result).toEqual(['submissions', true]);
    });

    it('builds query key for user (ignores status)', () => {
      const result = buildSubmissionsQueryKey(false, SUBMISSION_STATUS.PENDING_REVIEW);
      expect(result).toEqual(['submissions', false]);
    });

    it('builds query key for user without status', () => {
      const result = buildSubmissionsQueryKey(false);
      expect(result).toEqual(['submissions', false]);
    });
  });
});
