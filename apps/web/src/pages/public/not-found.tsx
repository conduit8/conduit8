import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { Link, useRouter } from '@tanstack/react-router';
import { Button } from '@web/ui/components/atoms';
import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';

import { PageLayout } from '@web/ui/components/layout/page/page-layout';

/**
 * NotFound page displayed when a route doesn't match any defined routes
 */
export const NotFoundPage = () => {
  const posthog = usePostHog();
  const router = useRouter();

  useEffect(() => {
    const path = window.location.pathname;
    console.info('404: Route not found', { path });

    // Track 404s  to catch broken links
    posthog.capture('404_page_view', { path });
  }, [posthog]);

  return (
    <PageLayout>
      <div className="flex min-h-svh items-center justify-center">
        <div className="bg-card w-full max-w-xl rounded-lg border border-border p-8 shadow-lg">
          <div className="mb-6 flex justify-center">
            <div className="bg-muted border-border flex h-16 w-16 items-center justify-center rounded-full border shadow-sm">
              <MagnifyingGlassIcon className="text-muted-foreground h-8 w-8" weight="regular" />
            </div>
          </div>

          <h1 className="text-foreground mb-4 text-center text-2xl font-bold">Page Not Found</h1>
          <p className="text-muted-foreground mb-6 text-center">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col space-y-2">
            <Button variant="default" className="w-full" onClick={() => router.history.back()}>
              Go back
            </Button>
            <Button asChild variant="outline" className="w-full hover:no-underline">
              <Link to="/">Return to homepage</Link>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
