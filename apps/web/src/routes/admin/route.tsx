import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { authClient } from '@web/lib/clients';

/**
 * Admin Guard Route
 *
 * Layout route that provides authentication + authorization for all admin routes.
 * Requires user to be logged in AND have admin role.
 *
 * Redirects to homepage if:
 * - User is not authenticated
 * - User does not have admin role
 */

function AdminLayout() {
  return <Outlet />;
}

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    console.debug('[Admin] Checking auth and role');

    const { data: session, error } = await authClient.getSession();

    // Check authentication
    if (!session?.user || error) {
      console.debug('[Admin] Not authenticated - redirecting to homepage');
      localStorage.setItem('auth_redirect', location.href);
      throw redirect({
        to: '/',
        search: {
          redirect: location.href,
        },
      });
    }

    // Check admin role
    if (session.user.role !== 'admin') {
      console.warn('[Admin] Unauthorized access attempt', {
        userId: session.user.id,
        role: session.user.role,
      });
      throw redirect({ to: '/' });
    }

    console.log('[Admin] User authorized');
  },
  component: AdminLayout,
});
