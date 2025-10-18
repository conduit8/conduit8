import { APP_ROUTES } from '@conduit8/core';
import { Hono } from 'hono';

import type { AppContext } from '@worker/entrypoints/api/types/context';

import { installSlackApp } from '@worker/application/handlers/installation/installation-handlers';
import { InstallSlackApp } from '@worker/domain/messages/commands';

const oauthRoutes = new Hono<AppContext>().basePath(APP_ROUTES.api.prefix);

// GET /api/v1/slack/oauth/callback - Handles OAuth callback from Slack
oauthRoutes.get(APP_ROUTES.api.slack.oauth.callback, async (c) => {
  const code = c.req.query('code');
  const state = c.req.query('state');

  console.info('OAuth callback received', { hasCode: !!code, hasState: !!state });

  if (!code) {
    console.error('Missing authorization code');
    return c.text('Missing authorization code', 400);
  }

  // TODO: OAuth state validation for CSRF protection (optional for now)

  try {
    // 1. Create command
    const command = new InstallSlackApp(code);

    // 2. Execute handler
    const { result: installation } = await installSlackApp(command, c.env);

    // 3. Redirect to OAuth result page in React app
    const params = new URLSearchParams({
      status: 'success',
      platform: 'slack',
      workspace: installation.teamName,
      teamId: installation.teamId,
      botUserId: installation.botUserId,
    });

    const redirectUrl = c.env.ENV === 'development'
      ? `http://localhost:5173/oauth?${params.toString()}`
      : `/oauth?${params.toString()}`;

    return c.redirect(redirectUrl);
  }
  catch (error) {
    console.error('OAuth callback failed', {
      error: String(error),
      code: `${code?.substring(0, 10)}...`, // Log partial code for debugging
    });

    // Redirect to React app with failure
    const params = new URLSearchParams({
      status: 'failed',
      platform: 'slack',
    });

    const redirectUrl = c.env.ENV === 'development'
      ? `http://localhost:5173/oauth?${params.toString()}`
      : `/oauth?${params.toString()}`;

    return c.redirect(redirectUrl);
  }
});

export default oauthRoutes;
