import type { ApiClientConfig } from '@kollektiv/core';

import { createApiClient } from '@kollektiv/core';

const KollektivApiConfig: ApiClientConfig = {
  caseConversion: false,
};

export const api = createApiClient(KollektivApiConfig);
