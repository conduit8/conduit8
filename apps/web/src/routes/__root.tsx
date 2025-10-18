import type { QueryClient } from '@tanstack/react-query';

// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRouteWithContext, HeadContent, Outlet } from '@tanstack/react-router';
import { useIdentifyPosthogUser } from '@web/lib/analytics';
import { useNetworkStatus } from '@web/lib/hooks';

import { UnhandledErrorPage } from '@web/pages/public/error';
import { NotFoundPage } from '@web/pages/public/not-found';

interface RouterContext {
  queryClient: QueryClient;
}

/**
 * Root Layout Component
 *
 * The top-level route component that wraps the entire application.
 * Currently acts as a simple passthrough - no global layout decisions made here.
 *
 * Features:
 * - Error boundary (ErrorFallback component)
 * - Not found page handling
 * - Router context for QueryClient
 * - Optional dev tools (commented out)
 */
function RootComponent() {
  useNetworkStatus();
  useIdentifyPosthogUser();

  return (
    <>
      <HeadContent />
      <Outlet />
      <ReactQueryDevtools buttonPosition="bottom-right" />
      {/* <TanStackRouterDevtools position={'bottom-right'} /> */}
    </>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFoundPage,
  errorComponent: UnhandledErrorPage,
});
