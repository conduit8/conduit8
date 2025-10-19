import type { AuthUser } from '@web/lib/auth/models';

import * as sections from '@web/pages/public/home/components';
import { SignInModal } from '@web/pages/public/home/components/sign-in-modal';

import { PageLayout } from '@web/ui/components/layout/page/page-layout';

import { LandingHeader } from './home-header';
import { LandingFooter } from './landing-footer';

interface LandingPageProps {
  user: AuthUser | null;
  loginModal: any;
}

export const HomePage = ({ user, loginModal }: LandingPageProps) => {
  return (
    <>
      <PageLayout
        header={<LandingHeader user={user} loginModal={loginModal} />}
        footer={<LandingFooter />}
        variant="full-width"
        contentPadding={false}
      >
        <sections.HeroSection user={user} />
        <sections.HowItWorksSection />
        <sections.FAQSection />
      </PageLayout>

      <SignInModal
        open={loginModal.isOpen}
        onOpenChange={open => open ? loginModal.open() : loginModal.close()}
      />
    </>
  );
};
