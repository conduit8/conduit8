import { useAuth } from '@web/lib/auth/hooks';
import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';

/**
 * Tracks new user sign-ups (created within 24 hours) for Google Ads conversions.
 * Uses localStorage to prevent duplicate tracking.
 */
export const useSignUpTracking = () => {
  const { user, error } = useAuth();
  // Store array of tracked user IDs instead of single boolean
  const [trackedUsers, setTrackedUsers] = useLocalStorage<string[]>('zaraz_tracked_signups', []);

  useEffect(() => {
    if (!user || error) {
      console.debug('[Zaraz] Skipping sign-up conversion - no user session');
      return;
    }

    if (!window.zaraz) {
      console.debug('[Zaraz] Skipping sign-up conversion - Zaraz not loaded');
      return;
    }

    const userId = user.id;

    // Check if THIS user was already tracked
    if (trackedUsers.includes(userId)) {
      console.debug(`[Zaraz] Skipping sign-up conversion - already tracked for user ${userId}`);
      return;
    }

    const createdAt = new Date(user.createdAt);
    const hoursSinceCreation = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);

    // User created within 24 hours = new sign-up
    if (hoursSinceCreation < 24) {
      window.zaraz.track('sign_up', {
        user_id: userId,
      });

      // Add this user to tracked list
      setTrackedUsers(prev => [...prev, userId]);
      console.log('[Zaraz] Sign-up conversion tracked for user:', userId);
    }
    else {
      console.debug(
        `[Zaraz] Skipping sign-up conversion - user created ${hoursSinceCreation.toFixed(1)} hours ago (>24h)`,
      );
    }
  }, [user, error, trackedUsers, setTrackedUsers]);
};
