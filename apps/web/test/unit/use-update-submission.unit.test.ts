import type { UpdateSubmissionRequest, UpdateSubmissionResponse } from '@conduit8/core';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useUpdateSubmission } from '@web/pages/admin/review/hooks/use-update-submission';
import { skillsApi } from '@web/pages/public/home/services/skills-api';

import { createSubmission, createSubmissionsResponse } from '../factories/submission.factory';

vi.mock('@web/pages/public/home/services/skills-api', () => ({
  skillsApi: {
    updateSubmission: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useUpdateSubmission', () => {
  it('updates cache with response data', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const submissionId = 'test-id-1';
    const existingSubmission = createSubmission({
      id: submissionId,
      category: 'development',
      author: 'happy-monkey-42',
      authorKind: 'community',
    });

    queryClient.setQueryData(
      ['submissions', true, 'pending_review'],
      createSubmissionsResponse([existingSubmission]),
    );

    const updates: UpdateSubmissionRequest = {
      category: 'design',
      author: 'clever-panda-99',
      authorKind: 'verified',
    };

    const mockResponse: UpdateSubmissionResponse = {
      success: true,
      data: {
        ...existingSubmission,
        ...updates,
      } as any,
    };

    vi.mocked(skillsApi.updateSubmission).mockResolvedValue(mockResponse);

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children);

    const { result } = renderHook(
      () => useUpdateSubmission(submissionId, 'pending_review'),
      { wrapper },
    );

    result.current.mutate(updates);

    await waitFor(() => {
      const cached = queryClient.getQueryData(['submissions', true, 'pending_review']);
      expect(cached).toBeDefined();
      expect((cached as any).data[0].category).toBe('design');
      expect((cached as any).data[0].author).toBe('clever-panda-99');
      expect((cached as any).data[0].authorKind).toBe('verified');
    });
  });

  it('handles cache miss gracefully', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const submissionId = 'test-id-1';
    const updates: UpdateSubmissionRequest = { category: 'design' };
    const mockResponse: UpdateSubmissionResponse = {
      success: true,
      data: createSubmission({ id: submissionId }) as any,
    };

    vi.mocked(skillsApi.updateSubmission).mockResolvedValue(mockResponse);

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children);

    const { result } = renderHook(
      () => useUpdateSubmission(submissionId, 'pending_review'),
      { wrapper },
    );

    result.current.mutate(updates);

    await waitFor(() => {
      const cached = queryClient.getQueryData(['submissions', true, 'pending_review']);
      expect(cached).toBeUndefined();
    });
  });
});
