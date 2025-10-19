import type { AppContext } from '@worker/entrypoints/api/types';

import { APP_ROUTES } from '@conduit8/core';
import type { GitHubStatsResponse } from '@conduit8/core';
import { MessageBus } from '@worker/application/message-bus';
import { GetGitHubStars } from '@worker/domain/messages/queries';
import { Hono } from 'hono';

const app = new Hono<AppContext>().basePath(APP_ROUTES.api.prefix);

/**
 * Get GitHub repository stats
 * GET /api/v1/github/stats
 */
app.get(APP_ROUTES.api.paths.githubStats, async (c) => {
  const messageBus = new MessageBus(c.env);
  const query = new GetGitHubStars('alexander-zuev', 'conduit8');

  const stars = await messageBus.handle(query, c.env);

  return c.json<GitHubStatsResponse>({
    success: true,
    data: { stars },
  });
});

export default app;
