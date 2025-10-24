import type { GetSkillResponse, ListSkillsResponse, Skill, TrackSkillDownloadResponse } from '@conduit8/core';

import { ApiError, createApiClient } from '@conduit8/core';

import { API_BASE_URL } from './config';
import { ApiUnavailableError, NetworkError, SkillNotFoundError } from './errors';

/**
 * Shared HTTP client for Conduit8 API
 */
const api = createApiClient({
  baseUrl: API_BASE_URL,
  caseConversion: false, // API already uses camelCase
  timeout: 30000, // 30s timeout for CLI operations
});

/**
 * Retry an API call with exponential backoff
 * @param fn - Function to retry
 * @param retries - Number of retry attempts (default: 3)
 * @returns Result of the function
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    }
    catch (error) {
      lastError = error as Error;

      // Don't retry on client errors (4xx) or ApiUnavailableError
      if (error instanceof ApiError) {
        if (error.status >= 400 && error.status < 500) {
          throw error; // Client error - don't retry
        }
      }
      if (error instanceof ApiUnavailableError || error instanceof SkillNotFoundError) {
        throw error; // Don't retry these
      }

      // Exponential backoff: 1s, 2s, 4s
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * 2 ** attempt));
      }
    }
  }

  throw lastError;
}

/**
 * Get skill by slug (with retry)
 */
export async function getSkill(slug: string): Promise<Skill> {
  return retryWithBackoff(async () => {
    try {
      const response = await api.get<GetSkillResponse>('/skills/:slug', {
        pathParams: { slug },
      });
      return response.data;
    }
    catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 404) {
          throw new SkillNotFoundError(slug);
        }
        if (error.status === 0 || error.kind === 'timeout' || error.kind === 'other') {
          throw new ApiUnavailableError();
        }
        throw new NetworkError(`Failed to fetch skill: ${error.message}`, error.status);
      }
      throw error;
    }
  });
}

/**
 * Search skills by query (with retry)
 */
export async function searchSkills(query?: string): Promise<Skill[]> {
  return retryWithBackoff(async () => {
    try {
      const response = await api.get<ListSkillsResponse>('/skills', {
        queryParams: query ? { q: query } : undefined,
      });
      return response.data;
    }
    catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 0 || error.kind === 'timeout' || error.kind === 'other') {
          throw new ApiUnavailableError();
        }
        throw new NetworkError(`Failed to search skills: ${error.message}`, error.status);
      }
      throw error;
    }
  });
}

/**
 * Track skill download
 * Fire and forget - logs errors but doesn't throw
 */
export async function trackDownload(slug: string): Promise<void> {
  try {
    await api.post<TrackSkillDownloadResponse>(
      '/skills/:slug/downloaded',
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
