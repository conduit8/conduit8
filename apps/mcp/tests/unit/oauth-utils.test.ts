import { describe, expect, it } from 'vitest';

import {
  addApprovedClient,
  bindStateToSession,
  isClientApproved,
} from '@mcp/infrastructure/oauth/utils';

describe('OAuth Security', () => {
  describe('Client approval flow', () => {
    it('approves and recognizes client', async () => {
      const clientId = 'test-client';
      const secret = 'test-secret';
      const emptyReq = new Request('https://example.com');

      const setCookie = await addApprovedClient(emptyReq, clientId, secret);
      const cookieValue = setCookie.split('=')[1]!.split(';')[0];

      const reqWithCookie = new Request('https://example.com', {
        headers: { Cookie: `__Host-APPROVED_CLIENTS=${cookieValue}` },
      });

      expect(await isClientApproved(reqWithCookie, clientId, secret)).toBe(true);
    });

    it('rejects unapproved client', async () => {
      const req = new Request('https://example.com');
      expect(await isClientApproved(req, 'unknown', 'secret')).toBe(false);
    });

    it('rejects tampered cookie signature', async () => {
      const clientId = 'test-client';
      const secret = 'test-secret';

      const setCookie = await addApprovedClient(
        new Request('https://example.com'),
        clientId,
        secret,
      );
      let cookieValue = setCookie.split('=')[1]!.split(';')[0]!;
      cookieValue = 'tampered.' + cookieValue.split('.')[1]!

      const req = new Request('https://example.com', {
        headers: { Cookie: `__Host-APPROVED_CLIENTS=${cookieValue}` },
      });

      expect(await isClientApproved(req, clientId, secret)).toBe(false);
    });
  });

  describe('State binding', () => {
    it('generates secure session cookie', async () => {
      const stateToken = 'test-state';
      const { setCookie } = await bindStateToSession(stateToken);

      expect(setCookie).toContain('__Host-CONSENTED_STATE=');
      expect(setCookie).toContain('HttpOnly');
      expect(setCookie).toContain('Secure');
      expect(setCookie).not.toContain(stateToken);
    });
  });
});
