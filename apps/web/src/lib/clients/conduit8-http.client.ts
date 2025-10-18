import type { ApiClientConfig } from '@conduit8/core';

import { createApiClient } from '@conduit8/core';

const Conduit8ApiConfig: ApiClientConfig = {
  caseConversion: false,
};

export const api = createApiClient(Conduit8ApiConfig);
