import { describe, expect, it } from 'vitest';

import { validateSession } from '@mcp/infrastructure/backend/client';

describe('Backend Client', () => {
  it('returns null for invalid session', async () => {
    const mockEnv = {
      WEB_APP_BASE_URL: 'https://invalid-url-that-will-fail.test',
    } as Env;

    const result = await validateSession(mockEnv, 'invalid-cookie');
    expect(result).toBeNull();
  });
});
