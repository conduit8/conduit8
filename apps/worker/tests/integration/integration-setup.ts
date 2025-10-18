import { vi } from 'vitest';

// Mock @slack/web-api to avoid node:os import issues in Workers environment
vi.mock('@slack/web-api', () => ({
  WebClient: vi.fn().mockImplementation(() => ({
    oauth: {
      v2: {
        access: vi.fn(),
      },
    },
  })),
  OauthV2AccessResponse: {},
}));

console.log('=== INTEGRATION TEST SETUP LOADED ===');
console.log('Current file:', __filename);
