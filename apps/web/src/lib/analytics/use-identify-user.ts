import { useAuth } from '@web/lib/auth';
import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';

// TODO: this is a usefule hook but
// It is essentially one specific hook from analytics / posthog
// We need to understand where and how it should be used though? it seems it is meant to be used on log in so in the route loader?
export const useIdentifyPosthogUser = () => {
  const posthog = usePostHog();
  const { user } = useAuth();
  const userId = user?.id;
  const email = user?.email;

  // This hook
  useEffect(() => {
    // Check if posthog exists (it's undefined when PostHog is disabled)
    if (posthog && userId) {
      const distinctId = posthog.get_distinct_id();
      // Check if distinctId exists and doesn't start with userId
      if (distinctId && !distinctId.startsWith(userId)) {
        console.debug(`Posthog user changed, calling posthog.identify`);
        posthog.identify(userId, {
          email,
        });
      }
    }
  }, [userId, email, posthog]);
};
