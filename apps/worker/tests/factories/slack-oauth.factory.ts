import type { OauthV2AccessResponse } from '@slack/web-api';

export class SlackOAuthFactory {
  static validResponse(overrides: Partial<OauthV2AccessResponse> = {}): OauthV2AccessResponse {
    return {
      ok: true,
      access_token: 'xoxb-test-token',
      token_type: 'bot',
      scope: 'chat:write,channels:read',
      bot_user_id: 'U123456789',
      app_id: 'A123456789',
      team: {
        id: 'T123456789',
        name: 'Test Workspace',
      },
      enterprise: {
        id: 'E123456789',
        name: 'Test Enterprise',
      },
      authed_user: {
        id: 'U987654321',
        access_token: 'xoxp-user-token',
      },
      ...overrides,
    };
  }

  static invalidResponse(
    field: 'ok' | 'team.id' | 'team.name' | 'access_token' | 'bot_user_id' | 'app_id',
  ): Partial<OauthV2AccessResponse> {
    const base = this.validResponse();

    switch (field) {
      case 'ok':
        return { ...base, ok: false as any };
      case 'team.id':
        return { ...base, team: { ...base.team, id: '' } };
      case 'team.name':
        return { ...base, team: { ...base.team, name: '' } };
      case 'access_token':
        return { ...base, access_token: '' };
      case 'bot_user_id':
        return { ...base, bot_user_id: '' };
      case 'app_id':
        return { ...base, app_id: '' };
    }
  }
}
