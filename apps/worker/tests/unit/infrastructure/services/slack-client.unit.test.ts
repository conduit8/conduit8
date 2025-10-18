import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SlackClient } from '@worker/infrastructure/services/slack/slack-client';
import { SlackClientError } from '@worker/infrastructure/errors/infrastructure.errors';

// Create the mock access function that we'll control per test
const mockAccess = vi.fn();

// Mock WebClient without importing the real module
vi.mock('@slack/web-api', () => ({
  WebClient: vi.fn().mockImplementation(() => ({
    oauth: {
      v2: {
        access: mockAccess,
      },
    },
  })),
}));

describe('slackClient', () => {
  const mockEnv = {
    SLACK_CLIENT_ID: 'test-client-id',
    SLACK_CLIENT_SECRET: 'test-client-secret',
  } as Env;

  beforeEach(() => {
    mockAccess.mockReset();
  });

  it('throws SlackClientError when SLACK_CLIENT_ID missing', () => {
    const env = {
      SLACK_CLIENT_SECRET: 'secret',
    } as Env;

    expect(() => new SlackClient(env)).toThrow(SlackClientError);
    expect(() => new SlackClient(env)).toThrow('Missing required Slack OAuth credentials');
  });

  it('returns OAuth response on successful exchange', async () => {
    const mockResponse = {
      ok: true,
      access_token: 'xoxb-test-token',
      team: { id: 'T123', name: 'Test Team' },
      bot_user_id: 'U123BOT',
      app_id: 'A123',
      scope: 'chat:write,channels:read',
      authed_user: {
        id: 'U123',
        access_token: 'xoxp-user-token',
      },
    };

    mockAccess.mockResolvedValue(mockResponse);

    const client = new SlackClient(mockEnv);
    const result = await client.getAccessResponse('test-code');

    expect(mockAccess).toHaveBeenCalledWith({
      client_id: 'test-client-id',
      client_secret: 'test-client-secret',
      code: 'test-code',
    });

    expect(result).toEqual(mockResponse);
  });

  it('throws SlackClientError when OAuth exchange fails', async () => {
    mockAccess.mockResolvedValue({
      ok: false,
      error: 'invalid_code',
    });

    const client = new SlackClient(mockEnv);

    await expect(client.getAccessResponse('bad-code')).rejects.toThrow(SlackClientError);
    await expect(client.getAccessResponse('bad-code')).rejects.toThrow('OAuth exchange failed: invalid_code');

    expect(mockAccess).toHaveBeenCalledWith({
      client_id: 'test-client-id',
      client_secret: 'test-client-secret',
      code: 'bad-code',
    });
  });
});
