import { APP_ROUTES } from '@conduit8/core';
import { settings } from '@web/lib/settings';
import { inferAdditionalFields, magicLinkClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */

  baseURL: `${settings.app.baseUrl}${APP_ROUTES.auth.basePath}`,
  plugins: [
    magicLinkClient(),
    inferAdditionalFields({
      user: {
        role: {
          type: 'string',
        },
      },
    }),
  ],
});

export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;
