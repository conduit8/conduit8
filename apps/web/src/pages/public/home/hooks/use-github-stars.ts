import { getApiRoute } from '@conduit8/core';
import { useQuery } from '@tanstack/react-query';

interface GitHubStatsResponse {
  success: boolean;
  data: {
    stars: number;
  };
}

async function fetchGitHubStars(): Promise<number> {
  const response = await fetch(getApiRoute('githubStats'));

  if (!response.ok) {
    throw new Error('Failed to fetch GitHub stars');
  }

  const data: GitHubStatsResponse = await response.json();
  return data.data.stars;
}

export function useGitHubStars() {
  return useQuery({
    queryKey: ['github-stars'],
    queryFn: fetchGitHubStars,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
  });
}
