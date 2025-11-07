import type { AuthRequest } from '@cloudflare/workers-oauth-provider';
import type { AppContext } from '@mcp/entrypoints/api/types';
import type { Context } from 'hono';

import { mcpAuthorizeRequestSchema } from '@conduit8/core';
import { zValidator } from '@mcp/entrypoints/api/utils';
import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';

import type { Props } from '@mcp/application/server';

import * as backendClient from '@mcp/infrastructure/backend/client';
import {
  addApprovedClient,
  bindStateToSession,
  createOAuthState,
  isClientApproved,
  OAuthError,
} from '@mcp/infrastructure/oauth/utils';

const oauthRoutes = new Hono<AppContext>();

oauthRoutes.get('/authorize', async (c) => {
  const oauthReqInfo = await c.env.OAUTH_PROVIDER.parseAuthRequest(c.req.raw);
  const { clientId } = oauthReqInfo;
  if (!clientId) {
    return c.text('Invalid request', 400);
  }

  // Extract session cookie from browser
  const sessionCookie = getCookie(c, 'better-auth.session_token');

  // Check if user is logged into Conduit8
  let user: { id: string; email: string; name: string } | null = null;
  if (sessionCookie) {
    try {
      user = await backendClient.validateSession(c.env, sessionCookie);
    }
    catch (error) {
      console.error('Failed to validate session:', error);
    }
  }

  // If not logged in, redirect to home page (will auto-open sign-in modal)
  if (!user) {
    const redirectUrl = new URL(c.req.url);
    const homeUrl = new URL('/', c.env.WEB_APP_BASE_URL);
    homeUrl.searchParams.set('redirect', redirectUrl.href);
    return c.redirect(homeUrl.href);
  }

  // Check if client is already approved
  if (await isClientApproved(c.req.raw, clientId, c.env.COOKIE_ENCRYPTION_KEY)) {
    // Skip approval dialog but still create secure state and bind to session
    const { stateToken } = await createOAuthState(oauthReqInfo, c.env.OAUTH_KV);
    const { setCookie: sessionBindingCookie } = await bindStateToSession(stateToken);

    // Complete authorization immediately
    // sessionCookie must exist if user exists (checked at line 41)
    if (!sessionCookie) {
      throw new OAuthError('invalid_request', 'Session cookie missing');
    }

    return await completeAuthorizationWithSession(
      c,
      oauthReqInfo,
      user,
      sessionCookie,
      sessionBindingCookie,
    );
  }

  // Validate required OAuth parameters
  if (!oauthReqInfo.redirectUri) {
    throw new OAuthError('invalid_request', 'Missing redirect_uri');
  }
  if (!oauthReqInfo.codeChallenge) {
    throw new OAuthError('invalid_request', 'Missing code_challenge (PKCE required)');
  }
  if (!oauthReqInfo.codeChallengeMethod) {
    throw new OAuthError('invalid_request', 'Missing code_challenge_method');
  }

  // Store OAuth request params in KV with state token
  const { stateToken } = await createOAuthState(oauthReqInfo, c.env.OAUTH_KV);
  const { setCookie: sessionBindingCookie } = await bindStateToSession(stateToken);

  // Store user info with state for web app to access
  await c.env.OAUTH_KV.put(
    `mcp:oauth:user:${stateToken}`,
    JSON.stringify({ userId: user.id, email: user.email, name: user.name, sessionCookie }),
    { expirationTtl: 600 },
  );

  // Build consent URL with validated params
  const consentUrl = new URL('/mcp/consent', c.env.WEB_APP_BASE_URL);
  consentUrl.searchParams.set('client_id', clientId);
  consentUrl.searchParams.set('redirect_uri', oauthReqInfo.redirectUri);
  consentUrl.searchParams.set('state', stateToken);
  consentUrl.searchParams.set('code_challenge', oauthReqInfo.codeChallenge);
  consentUrl.searchParams.set('code_challenge_method', oauthReqInfo.codeChallengeMethod);

  if (oauthReqInfo.scope) {
    const scopeString = Array.isArray(oauthReqInfo.scope)
      ? oauthReqInfo.scope.join(' ')
      : oauthReqInfo.scope;
    consentUrl.searchParams.set('scope', scopeString);
  }

  const headers = new Headers({ Location: consentUrl.href });
  headers.set('Set-Cookie', sessionBindingCookie);

  return new Response(null, { status: 302, headers });
});

oauthRoutes.post('/authorize', zValidator('json', mcpAuthorizeRequestSchema), async (c) => {
  const body = c.req.valid('json');

  // Retrieve OAuth request from KV
  const oauthReqData = await c.env.OAUTH_KV.get(`mcp:oauth:state:${body.state}`);
  if (!oauthReqData) {
    throw new OAuthError('invalid_request', 'Invalid or expired state');
  }

  const oauthReqInfo = JSON.parse(oauthReqData) as AuthRequest;

  // Retrieve user info from KV
  const userData = await c.env.OAUTH_KV.get(`mcp:oauth:user:${body.state}`);
  if (!userData) {
    throw new OAuthError('invalid_request', 'Invalid or expired state');
  }

  const user = JSON.parse(userData) as {
    userId: string;
    email: string;
    name: string;
    sessionCookie: string;
  };

  // User denied access
  if (!body.approved) {
    const callbackUrl = new URL(oauthReqInfo.redirectUri);
    callbackUrl.searchParams.set('error', 'access_denied');
    callbackUrl.searchParams.set('state', body.state);

    return c.json({ redirectTo: callbackUrl.href });
  }

  // User approved - add client to approved list
  const approvedClientCookie = await addApprovedClient(
    c.req.raw,
    oauthReqInfo.clientId,
    c.env.COOKIE_ENCRYPTION_KEY,
  );

  // Complete authorization
  const response = await completeAuthorizationWithSession(
    c,
    oauthReqInfo,
    { id: user.userId, email: user.email, name: user.name },
    user.sessionCookie,
  );

  // Clean up KV state (single-use)
  await c.env.OAUTH_KV.delete(`mcp:oauth:state:${body.state}`);
  await c.env.OAUTH_KV.delete(`mcp:oauth:user:${body.state}`);

  // Return redirect URL for web app to use
  const redirectTo = response.headers.get('Location');
  return c.json({
    redirectTo,
    setCookie: approvedClientCookie,
  });
});

async function completeAuthorizationWithSession(
  c: Context<AppContext>,
  oauthReqInfo: AuthRequest,
  user: { id: string; email: string; name: string },
  sessionCookie: string,
  clearSessionCookie?: string,
) {
  // Return MCP token with embedded session cookie
  const { redirectTo } = await c.env.OAUTH_PROVIDER.completeAuthorization({
    metadata: {
      label: user.name || user.email,
    },
    // This will be available on this.props inside Conduit8MCP
    props: {
      userId: user.id,
      email: user.email,
      name: user.name,
      sessionCookie, // Store session cookie in OAuth token (encrypted)
    } as Props,
    request: oauthReqInfo,
    scope: oauthReqInfo.scope,
    userId: user.id,
  });

  // Clear the session binding cookie (one-time use)
  const headers = new Headers({ Location: redirectTo });
  if (clearSessionCookie) {
    headers.set('Set-Cookie', clearSessionCookie);
  }

  return new Response(null, {
    status: 302,
    headers,
  });
}

export default oauthRoutes;
