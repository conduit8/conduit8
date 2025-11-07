import type { ApiClientConfig } from '@conduit8/core';

import { createApiClient } from '@conduit8/core';
import { settings } from '@web/lib/settings';

const McpApiConfig: ApiClientConfig = {
  baseUrl: settings.mcp.url,
  caseConversion: false,
};

export const mcpApi = createApiClient(McpApiConfig);
