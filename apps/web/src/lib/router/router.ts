import { createRouter } from '@tanstack/react-router';
import { queryClient } from '@web/lib/clients';

import { routeTree } from './routeTree.gen';

// Create a new router instance
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadDelay: 250,
  defaultPreloadStaleTime: 10 * 60 * 1000, // 10 minutes in milliseconds
  scrollRestoration: true,
  context: {
    queryClient,
  },
});
