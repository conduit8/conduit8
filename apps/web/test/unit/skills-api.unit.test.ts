import type { ListSkillsResponse } from '@conduit8/core';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { skillsApi } from '@web/pages/public/home/services/skills-api';

// Mock the API client
vi.mock('@web/lib/clients/conduit8-http.client', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('skillsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls API with correct endpoint and query params', async () => {
    const { api } = await import('@web/lib/clients/conduit8-http.client');
    const mockResponse: ListSkillsResponse = {
      success: true,
      data: [],
    };

    vi.mocked(api.get).mockResolvedValue(mockResponse);

    const query = { q: 'test', limit: 20, offset: 0 };
    const result = await skillsApi.listSkills(query);

    expect(api.get).toHaveBeenCalledWith('/api/v1/skills', { queryParams: query });
    expect(result).toEqual(mockResponse);
  });

  it('returns skills data from API', async () => {
    const { api } = await import('@web/lib/clients/conduit8-http.client');
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
          zipUrl: 'https://example.com/skills/test.zip',
          imageUrl: 'https://example.com/images/test.png',
          videoUrl: 'https://example.com/videos/test.mp4',
        },
      ],
    };

    vi.mocked(api.get).mockResolvedValue(mockResponse);

    const result = await skillsApi.listSkills({ q: undefined, limit: 20, offset: 0 });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].slug).toBe('test-skill');
  });
});
