/**
 * Query definitions for read-only data retrieval
 *
 * Naming convention: "Get" + Entity + Optional Qualifier
 * - GetUserTranscriptions - list of user's transcriptions
 * - GetTranscriptionById - single transcription by ID
 * - GetTranscriptionCount - count of transcriptions
 *
 * Queries return DTOs/plain data, not domain models
 */

import { BaseQuery } from './base';

/**
 * Get GitHub repository star count
 * Returns cached value from KV, refreshed periodically
 */
export class GetGitHubStars extends BaseQuery<number, 'GetGitHubStars'> {
  readonly name = 'GetGitHubStars';

  constructor(
    public readonly owner: string,
    public readonly repo: string,
  ) {
    super();
  }
}

/**
 * Get single skill by slug
 */
export class GetSkill extends BaseQuery<unknown, 'GetSkill'> {
  readonly name = 'GetSkill';

  constructor(public readonly slug: string) {
    super();
  }
}

/**
 * List skills with optional search query
 */
export class ListSkills extends BaseQuery<unknown[], 'ListSkills'> {
  readonly name = 'ListSkills';

  constructor(
    public readonly query?: string,
    public readonly limit = 50,
    public readonly offset = 0,
  ) {
    super();
  }
}
