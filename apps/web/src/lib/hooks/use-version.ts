import type { HealthResponse } from '@kollektiv/core';

import { useQuery } from '@tanstack/react-query';

import { api } from '@web/lib/clients/kollektiv-http.client';

import { settings } from '../settings';

export const useVersionLogging = () => {
  const { data } = useQuery({
    queryKey: ['version'],
    queryFn: async () => {
      const response = await api.get<HealthResponse>('/api/v1/health');
      return response.data.version;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
    retry: false, // Don't retry if it fails - not critical
    refetchOnWindowFocus: false, // Don't refetch on tab focus
    refetchOnMount: false, // Don't refetch when component mounts if data exists
  });

  // Log version info when it arrives
  if (data) {
    console.debug(`🚀 ${settings.app.name} v${data.id} (${data.environment}). Deployed: ${new Date(data.timestamp).toLocaleString()}`);
  }
};
