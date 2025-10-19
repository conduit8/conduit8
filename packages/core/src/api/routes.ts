/**
 * App Routes Configuration
 *
 * Centralized definition of all application routes with proper typing.
 * Used by frontend client and worker for consistency.
 */

export const APP_ROUTES = {
  client: {
    prefix: '/',
    paths: {
      dashboard: '/dashboard',
      account: '/account',
    },
  },
  auth: {
    basePath: '/auth',
  },
  api: {
    prefix: '/api/v1',
    paths: {
      health: '/health',
      imageProxy: '/image-proxy',
      auth: '/auth',
      githubStats: '/github/stats',
      skills: '/skills',
      skill_by_id: '/skills/:id',
      skill_download: '/skills/:id/downloaded',
    },
    slack: {
      events: '/slack/events',
      interactions: '/slack/interactions',
      oauth: {
        callback: '/slack/oauth/callback',
        result: '/slack/oauth/result',
      },
    },
  },
} as const;

export function getApiRoute(path: keyof typeof APP_ROUTES.api.paths): FullApiRoutePath {
  return `${APP_ROUTES.api.prefix}${APP_ROUTES.api.paths[path]}` as FullApiRoutePath;
}

// Type definitions
export type ApiRoutePath = keyof typeof APP_ROUTES.api.paths;
export type FullApiRoutePath
  = `${typeof APP_ROUTES.api.prefix}${(typeof APP_ROUTES.api.paths)[ApiRoutePath]}`;
