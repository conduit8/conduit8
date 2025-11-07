import type { McpAuthorizeResponse } from '@conduit8/core';

import { APP_ROUTES } from '@conduit8/core';
import { useMutation } from '@tanstack/react-query';

import { mcpApi } from '@web/lib/clients/mcp-http.client';

interface McpConsentParams {
  state: string;
}

const authorizeRequest = async (
  state: string,
  approved: boolean,
): Promise<McpAuthorizeResponse> => {
  return mcpApi.post<McpAuthorizeResponse>(
    APP_ROUTES.mcp.paths.authorize,
    { state, approved },
  );
};

export const useMcpConsent = ({ state }: McpConsentParams) => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: (approved: boolean) => authorizeRequest(state, approved),
    onSuccess: (data) => {
      if (!data.redirectTo) {
        console.error('MCP authorization succeeded but no redirect URL provided');
        return;
      }
      window.location.replace(data.redirectTo);
    },
  });

  return {
    approve: () => mutate(true),
    deny: () => mutate(false),
    isLoading: isPending,
    error: error?.message ?? null,
  };
};
