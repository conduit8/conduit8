import type { SuccessResponse } from './base.schemas';

export interface GitHubStatsData {
  stars: number;
}

export type GitHubStatsResponse = SuccessResponse<GitHubStatsData>;
