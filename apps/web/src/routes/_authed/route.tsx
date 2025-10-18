import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { authClient } from '@web/lib/clients';

/**
 * Auth Guard Route
 *
 * Pathless route that provides authentication protection for all child routes.
 * Redirects to homepage if user is not authenticated.
 *
 * Structure:
 * - No layout decisions (just auth check)
 * - Child routes handle their own layouts (dashboard with sidebar, etc.)
 *
 * Child routes:
 * - /_auth/_dashboard/* - Dashboard pages with sidebar layout
 * - /_auth/settings - Settings page (if not using dashboard layout)
 * - etc.
 */

// Component that handles tracking and renders children
function AuthenticatedLayout() {
  return <Outlet />;
}

export const Route = createFileRoute('/_authed')({
  beforeLoad: async ({ location }) => {
    console.debug('Checking auth');

    const { data: session, error } = await authClient.getSession();

    if (!session?.user || error) {
      console.debug('Not authenticated - redirecting to homepage');
      localStorage.setItem('auth_redirect', location.href);
      throw redirect({
        to: '/',
        search: {
          redirect: location.href,
        },
      });
    }
    console.log('User authenticated');
  },
  component: AuthenticatedLayout,
});
