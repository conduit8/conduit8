import type { SuccessResponse } from './base.schemas';

export interface VersionInfo {
  id: string;
  tag: string | null;
  timestamp: string;
  environment: string;
}

export interface HealthData {
  status: 'healthy';
  version: VersionInfo;
}

export type HealthResponse = SuccessResponse<HealthData>;
