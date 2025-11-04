import type { AuthRequest, OAuthHelpers } from '@cloudflare/workers-oauth-provider';
import { Hono } from 'hono';

import type { Props } from './server';

import * as backendClient from '@mcp/infrastructure/backend/client';
import {
  addApprovedClient,
  bindStateToSession,
  createOAuthState,
  generateCSRFProtection,
  isClientApproved,
  OAuthError,
  renderApprovalDialog,
  validateCSRFToken,
} from '@mcp/infrastructure/oauth/utils';

const app = new Hono<{ Bindings: Env & { OAUTH_PROVIDER: OAuthHelpers } }>();

app.get('/authorize', async (c) => {
  const oauthReqInfo = await c.env.OAUTH_PROVIDER.parseAuthRequest(c.req.raw);
  const { clientId } = oauthReqInfo;
  if (!clientId) {
    return c.text('Invalid request', 400);
  }

  // Extract session cookie from browser
  const sessionCookie = c.req.header('Cookie')?.match(/better-auth\.session_token=([^;]+)/)?.[1];

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

  // If not logged in, redirect to Conduit8 login
  if (!user) {
    const redirectUrl = new URL(c.req.url);
    const loginUrl = new URL('/auth/sign-in', c.env.BACKEND_BASE_URL);
    loginUrl.searchParams.set('redirect', redirectUrl.href);
    return c.redirect(loginUrl.href);
  }

  // Check if client is already approved
  if (await isClientApproved(c.req.raw, clientId, c.env.COOKIE_ENCRYPTION_KEY)) {
    // Skip approval dialog but still create secure state and bind to session
    const { stateToken } = await createOAuthState(oauthReqInfo, c.env.OAUTH_KV);
    const { setCookie: sessionBindingCookie } = await bindStateToSession(stateToken);

    // Complete authorization immediately
    return await completeAuthorizationWithSession(
      c,
      oauthReqInfo,
      user,
      sessionCookie!,
      sessionBindingCookie,
    );
  }

  // Generate CSRF protection for the approval form
  const { token: csrfToken, setCookie } = generateCSRFProtection();

  return renderApprovalDialog(c.req.raw, {
    client: await c.env.OAUTH_PROVIDER.lookupClient(clientId),
    csrfToken,
    server: {
      description: 'Access your Conduit8 skills and execute them remotely.',
      logo: 'https://conduit8.dev/logo.png',
      name: 'Conduit8 MCP Server',
    },
    setCookie,
    state: { oauthReqInfo, sessionCookie, user },
  });
});

app.post('/authorize', async (c) => {
  try {
    // Read form data once
    const formData = await c.req.raw.formData();

    // Validate CSRF token
    validateCSRFToken(formData, c.req.raw);

    // Extract state from form data
    const encodedState = formData.get('state');
    if (!encodedState || typeof encodedState !== 'string') {
      return c.text('Missing state in form data', 400);
    }

    let state: {
      oauthReqInfo?: AuthRequest;
      sessionCookie?: string;
      user?: { id: string; email: string; name: string };
    };
    try {
      state = JSON.parse(atob(encodedState));
    }
    catch (_e) {
      return c.text('Invalid state data', 400);
    }

    if (!state.oauthReqInfo || !state.oauthReqInfo.clientId || !state.sessionCookie || !state.user) {
      return c.text('Invalid request', 400);
    }

    // Add client to approved list
    const approvedClientCookie = await addApprovedClient(
      c.req.raw,
      state.oauthReqInfo.clientId,
      c.env.COOKIE_ENCRYPTION_KEY,
    );

    // Create OAuth state and bind it to this user's session
    const { stateToken } = await createOAuthState(state.oauthReqInfo, c.env.OAUTH_KV);
    const { setCookie: sessionBindingCookie } = await bindStateToSession(stateToken);

    // Complete authorization with session cookie
    const response = await completeAuthorizationWithSession(
      c,
      state.oauthReqInfo,
      state.user,
      state.sessionCookie,
      sessionBindingCookie,
    );

    // Add approved client cookie to response
    const headers = new Headers(response.headers);
    headers.append('Set-Cookie', approvedClientCookie);

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  }
  catch (error: any) {
    console.error('POST /authorize error:', error);
    if (error instanceof OAuthError) {
      return error.toResponse();
    }
    return c.text(`Internal server error: ${error.message}`, 500);
  }
});

async function completeAuthorizationWithSession(
  c: any,
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

export { app as OAuthRoutes };
