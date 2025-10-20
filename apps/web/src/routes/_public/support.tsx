import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@web/lib/auth/hooks';

import { useLoginModal } from '@web/pages/public/home/hooks/use-login-modal';
import { SupportPage } from '@web/pages/public/support';

export const Route = createFileRoute('/_public/support')({
  component: RouteComponent,
});

function RouteComponent() {
  const loginModal = useLoginModal();
  const { user } = useAuth();

  return <SupportPage user={user} loginModal={loginModal} />;
}
