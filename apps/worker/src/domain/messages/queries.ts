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
