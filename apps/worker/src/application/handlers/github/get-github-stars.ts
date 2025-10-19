import type { QueryHandler } from '@worker/application/handlers/types';
import type { GetGitHubStars } from '@worker/domain/messages/queries';

const CACHE_TTL_SECONDS = 3600; // 1 hour

export const getGitHubStars: QueryHandler<GetGitHubStars, number> = async (
  query: GetGitHubStars,
  env: Env,
) => {
  const cacheKey = `github:stars:${query.owner}:${query.repo}`;

  // Try cache first
  const cached = await env.KV.get(cacheKey);
  if (cached) {
    return Number.parseInt(cached, 10);
  }

  // Fetch from GitHub API
  try {
    const response = await fetch(
      `https://api.github.com/repos/${query.owner}/${query.repo}`,
      {
        headers: {
          'User-Agent': 'Conduit8',
          'Accept': 'application/vnd.github.v3+json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json<{ stargazers_count: number }>();
    const stars = data.stargazers_count;

    // Cache result
    await env.KV.put(cacheKey, stars.toString(), {
      expirationTtl: CACHE_TTL_SECONDS,
    });

    return stars;
  }
  catch (error) {
    console.error('[GitHub API Error]', { owner: query.owner, repo: query.repo, error });
    throw error;
  }
};
