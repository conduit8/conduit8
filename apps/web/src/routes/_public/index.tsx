import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@web/lib/auth/hooks';
import { useVersionLogging } from '@web/lib/hooks';
import { HomePage } from '@web/pages/public/home';

import { useLoginModal } from '@web/pages/public/home/hooks/use-login-modal';

export const Route = createFileRoute('/_public/')({
  component: RouteComponent,
});

function RouteComponent() {
  const loginModal = useLoginModal();
  useVersionLogging();
  const { user } = useAuth();

  return (
    <HomePage user={user} loginModal={loginModal} />
  );
}
