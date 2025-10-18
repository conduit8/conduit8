import { vi } from 'vitest';

// Mock @slack/web-api to prevent Node.js module issues in Cloudflare Workers tests
export function setupSlackMocks() {
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
      conversations: {
        open: vi.fn(),
      },
      views: {
        publish: vi.fn(),
        open: vi.fn(),
        update: vi.fn(),
      },
      assistant: {
        threads: {
          setStatus: vi.fn(),
          setSuggestedPrompts: vi.fn(),
          setTitle: vi.fn(),
        },
      },
    })),
  }));
}
