// workers-oauth-utils.ts
// OAuth utility functions with CSRF and state validation security fixes

import type { AuthRequest } from '@cloudflare/workers-oauth-provider';

/**
 * OAuth 2.1 compliant error class.
 * Represents errors that occur during OAuth operations with standardized error codes and descriptions.
 */
export class OAuthError extends Error {
  /**
   * Creates a new OAuthError
   * @param code - The OAuth error code (e.g., "invalid_request", "invalid_grant")
   * @param description - Human-readable error description
   * @param statusCode - HTTP status code to return (defaults to 400)
   */
  constructor(
    public code: string,
    public description: string,
    public statusCode = 400,
  ) {
    super(description);
    this.name = 'OAuthError';
  }

  /**
   * Converts the error to a standardized OAuth error response
   * @returns HTTP Response with JSON error body
   */
  toResponse(): Response {
    return new Response(
      JSON.stringify({
        error: this.code,
        error_description: this.description,
      }),
      {
        status: this.statusCode,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}

/**
 * Result from createOAuthState containing the state token
 */
export interface OAuthStateResult {
  /**
   * The generated state token to be used in OAuth authorization requests
   */
  stateToken: string;
}

/**
 * Result from bindStateToSession containing the cookie to set
 */
export interface BindStateResult {
  /**
   * Set-Cookie header value to bind the state to the user's session
   */
  setCookie: string;
}

/**
 * Creates and stores OAuth state information, returning a state token
 * @param oauthReqInfo - OAuth request information to store with the state
 * @param kv - Cloudflare KV namespace for storing OAuth state data
 * @param stateTTL - Time-to-live for OAuth state in seconds (defaults to 600)
 * @returns Object containing the state token (KV-only validation, no cookie needed)
 */
export async function createOAuthState(
  oauthReqInfo: AuthRequest,
  kv: KVNamespace,
  stateTTL = 600,
): Promise<OAuthStateResult> {
  const stateToken = crypto.randomUUID();

  // Store state in KV (secure, one-time use, with TTL)
  await kv.put(`mcp:oauth:state:${stateToken}`, JSON.stringify(oauthReqInfo), {
    expirationTtl: stateTTL,
  });

  return { stateToken };
}

/**
 * Binds an OAuth state token to the user's browser session using a secure cookie.
 * This prevents CSRF attacks where an attacker's state token is used by a victim.
 *
 * SECURITY: This cookie proves that the browser completing the OAuth callback
 * is the same browser that consented to the authorization request.
 *
 * We hash the state token rather than storing it directly for defense-in-depth:
 * - Even if the state parameter leaks (URL logs, referrer headers), the cookie value cannot be derived
 * - The cookie serves as cryptographic proof of consent, not just a copy of the state
 * - Provides an additional layer of security beyond HttpOnly/Secure flags
 *
 * @param stateToken - The state token to bind to the session
 * @returns Object containing the Set-Cookie header to send to the client
 */
export async function bindStateToSession(stateToken: string): Promise<BindStateResult> {
  const consentedStateCookieName = '__Host-CONSENTED_STATE';

  // Hash the state token to provide defense-in-depth
  const encoder = new TextEncoder();
  const data = encoder.encode(stateToken);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  const setCookie = `${consentedStateCookieName}=${hashHex}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=600`;

  return { setCookie };
}

/**
 * Checks if a client has been previously approved by the user
 * @param request - The HTTP request containing cookies
 * @param clientId - The OAuth client ID to check
 * @param cookieSecret - Secret key used for signing and verifying cookie data
 * @returns True if the client is in the user's approved clients list
 */
export async function isClientApproved(
  request: Request,
  clientId: string,
  cookieSecret: string,
): Promise<boolean> {
  const approvedClients = await getApprovedClientsFromCookie(request, cookieSecret);
  return approvedClients?.includes(clientId) ?? false;
}

/**
 * Adds a client to the user's list of approved clients
 * @param request - The HTTP request containing existing cookies
 * @param clientId - The OAuth client ID to add
 * @param cookieSecret - Secret key used for signing and verifying cookie data
 * @returns Set-Cookie header value with the updated approved clients list
 */
export async function addApprovedClient(
  request: Request,
  clientId: string,
  cookieSecret: string,
): Promise<string> {
  const approvedClientsCookieName = '__Host-APPROVED_CLIENTS';
  const THIRTY_DAYS_IN_SECONDS = 2592000;

  const existingApprovedClients
    = (await getApprovedClientsFromCookie(request, cookieSecret)) || [];
  const updatedApprovedClients = Array.from(new Set([...existingApprovedClients, clientId]));

  const payload = JSON.stringify(updatedApprovedClients);
  const signature = await signData(payload, cookieSecret);
  const cookieValue = `${signature}.${btoa(payload)}`;

  return `${approvedClientsCookieName}=${cookieValue}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=${THIRTY_DAYS_IN_SECONDS}`;
}

// --- Helper Functions ---

async function getApprovedClientsFromCookie(
  request: Request,
  cookieSecret: string,
): Promise<string[] | null> {
  const approvedClientsCookieName = '__Host-APPROVED_CLIENTS';

  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader)
    return null;

  const cookies = cookieHeader.split(';').map(c => c.trim());
  const targetCookie = cookies.find(c => c.startsWith(`${approvedClientsCookieName}=`));

  if (!targetCookie)
    return null;

  const cookieValue = targetCookie.substring(approvedClientsCookieName.length + 1);
  const parts = cookieValue.split('.');

  if (parts.length !== 2)
    return null;

  const signatureHex = parts[0]!;
  const base64Payload = parts[1]!;
  const payload = atob(base64Payload);

  const isValid = await verifySignature(signatureHex, payload, cookieSecret);

  if (!isValid)
    return null;

  try {
    const approvedClients = JSON.parse(payload);
    if (
      !Array.isArray(approvedClients)
      || !approvedClients.every(item => typeof item === 'string')
    ) {
      return null;
    }
    return approvedClients as string[];
  }
  catch {
    return null;
  }
}

async function signData(data: string, secret: string): Promise<string> {
  const key = await importKey(secret);
  const enc = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function verifySignature(
  signatureHex: string,
  data: string,
  secret: string,
): Promise<boolean> {
  const key = await importKey(secret);
  const enc = new TextEncoder();
  try {
    const signatureBytes = new Uint8Array(
      signatureHex.match(/.{1,2}/g)!.map(byte => Number.parseInt(byte, 16)),
    );
    return await crypto.subtle.verify('HMAC', key, signatureBytes.buffer, enc.encode(data));
  }
  catch {
    return false;
  }
}

async function importKey(secret: string): Promise<CryptoKey> {
  if (!secret) {
    throw new Error('cookieSecret is required for signing cookies');
  }
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { hash: 'SHA-256', name: 'HMAC' },
    false,
    ['sign', 'verify'],
  );
}
