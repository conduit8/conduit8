import type { GetSkillResponse, Skill, TrackSkillDownloadResponse } from '@conduit8/core';

import { ApiError, createApiClient } from '@conduit8/core';

import { API_BASE_URL } from './config';

/**
 * Shared HTTP client for Conduit8 API
 */
const api = createApiClient({
  baseUrl: API_BASE_URL,
  caseConversion: false, // API already uses camelCase
  timeout: 30000, // 30s timeout for CLI operations
});

/**
 * Get skill by slug
 */
export async function getSkill(slug: string): Promise<Skill> {
  try {
    const response = await api.get<GetSkillResponse>('/v1/skills/:slug', {
      pathParams: { slug },
    });
    return response.data;
  }
  catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new Error(`Skill '${slug}' not found in registry`);
    }
    throw error;
  }
}

/**
 * Search skills by query
 * TODO: Implement when search endpoint is available
 */
export async function searchSkills(query?: string): Promise<Skill[]> {
  // TODO: Implement GET /api/v1/skills?q=query when endpoint is ready
  throw new Error('Search endpoint not yet implemented');
}

/**
 * Track skill download
 * Fire and forget - logs errors but doesn't throw
 */
export async function trackDownload(slug: string): Promise<void> {
  try {
    await api.post<TrackSkillDownloadResponse>(
      '/v1/skills/:slug/downloaded',
      {},
      { pathParams: { slug } },
    );
  }
  catch (error) {
    // Fire and forget - log but don't throw
    if (error instanceof ApiError) {
      console.warn(`Failed to track download for ${slug}: ${error.message}`);
    }
  }
}
