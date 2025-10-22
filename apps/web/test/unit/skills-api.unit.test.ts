import type { ListSkillsResponse } from '@conduit8/core';

import { describe, expect, it, vi } from 'vitest';

import { skillsApi } from '@web/pages/public/home/services/skills-api';

// Mock the API client
vi.mock('@web/lib/clients', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('skillsApi', () => {
  it('calls API with correct endpoint and query params', async () => {
    const { api } = await import('@web/lib/clients');
    const mockResponse: ListSkillsResponse = {
      success: true,
      data: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };

    vi.mocked(api.get).mockResolvedValue(mockResponse);

    const query = { page: 1, limit: 20, search: 'test' };
    const result = await skillsApi.list(query);

    expect(api.get).toHaveBeenCalledWith('/api/v1/skills', { queryParams: query });
    expect(result).toEqual(mockResponse);
  });

  it('returns skills data from API', async () => {
    const { api } = await import('@web/lib/clients');
    const mockResponse: ListSkillsResponse = {
      success: true,
      data: [
        {
          id: '1',
          slug: 'test-skill',
          name: 'Test Skill',
          description: 'A test skill',
          category: 'development',
          authorKind: 'verified',
          downloadCount: 10,
          author: 'Test',
          sourceType: 'import',
          sourceUrl: 'https://example.com',
          zipKey: 'skills/test.zip',
          imageKey: 'images/test.png',
          examples: ['Example'],
          curatorNote: null,
        },
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };

    vi.mocked(api.get).mockResolvedValue(mockResponse);

    const result = await skillsApi.list({ page: 1, limit: 20 });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].slug).toBe('test-skill');
  });
});
