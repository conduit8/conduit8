import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@web/lib/auth/hooks';
import { useVersionLogging } from '@web/lib/hooks';
import { LandingPage } from '@web/pages/public/landing';

import { useLoginModal } from '@web/pages/public/landing/hooks/use-login-modal';

export const Route = createFileRoute('/_public/')({
  component: RouteComponent,
});

function RouteComponent() {
  const loginModal = useLoginModal();
  useVersionLogging();
  const { user } = useAuth();

  return (
    <LandingPage user={user} loginModal={loginModal} />
  );
}
