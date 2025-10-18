import type { OauthV2AccessResponse } from '@slack/web-api';

import { WebClient } from '@slack/web-api';

import { SlackClientError } from '@worker/infrastructure/errors/infrastructure.errors';

export class SlackClient {
  private readonly webClient: WebClient;

  constructor(private readonly env: Env) {
    // Validate required environment variables
    if (!env.SLACK_CLIENT_ID || !env.SLACK_CLIENT_SECRET) {
      throw new SlackClientError('Missing required Slack OAuth credentials in environment');
    }

    // Initialize WebClient without token (for OAuth operations)
    this.webClient = new WebClient();
  }

  /**
   * Exchange OAuth code for access tokens
   */
  async getAccessResponse(code: string): Promise<OauthV2AccessResponse> {
    try {
      console.info('Exchanging OAuth code for tokens', {
        hasCode: !!code,
      });

      const result = await this.webClient.oauth.v2.access({
        client_id: this.env.SLACK_CLIENT_ID,
        client_secret: this.env.SLACK_CLIENT_SECRET,
        code,
      });

      if (!result.ok) {
        console.error('OAuth token exchange failed', {
          error: result.error,
          code: `${code?.substring(0, 10)}...`,
        });
        throw new SlackClientError(
          `OAuth exchange failed: ${result.error}`,
          new Error(result.error || 'Unknown OAuth error'),
        );
      }

      console.info('OAuth exchange successful', {
        teamId: result.team?.id,
        teamName: result.team?.name,
        botUserId: result.bot_user_id,
        scopes: result.scope,
        hasUserToken: !!result.authed_user?.access_token,
      });

      return result;
    }
    catch (error) {
      console.error('OAuth token exchange error', {
        error: error instanceof Error ? error.message : String(error),
        code: `${code?.substring(0, 10)}...`,
      });

      if (error instanceof SlackClientError) {
        throw error; // Re-throw domain-specific errors
      }

      throw new SlackClientError(
        `OAuth token exchange failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
