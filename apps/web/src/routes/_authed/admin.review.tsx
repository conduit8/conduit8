import { createFileRoute, redirect } from '@tanstack/react-router';
import { authClient } from '@web/lib/clients';
import { AdminReviewPage } from '@web/pages/admin/review';

/**
 * Admin Review Route
 * Protected route for reviewing pending skills
 * Only accessible by admin users
 */

// TODO: Replace with actual admin email from environment variable
const ADMIN_EMAIL = 'azuevpersonal@gmail.com';

export const Route = createFileRoute('/_authed/admin/review')({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();

    // Check if user is admin
    if (session?.user?.email !== ADMIN_EMAIL) {
      console.warn('[Admin] Unauthorized access attempt');
      throw redirect({ to: '/' });
    }
  },
  component: AdminReviewPage,
});
