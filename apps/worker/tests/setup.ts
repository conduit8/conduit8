import { vi } from 'vitest';

// Mock @slack/web-api before any imports to prevent Node.js module issues
vi.mock('@slack/web-api', () => ({
  WebClient: vi.fn().mockImplementation(() => ({
    oauth: {
      v2: {
        access: vi.fn(),
      },
    },
    chat: {
      postMessage: vi.fn(),
      update: vi.fn(),
    },
    assistant: {
      threads: {
        setStatus: vi.fn(),
      },
    },
  })),
}));
