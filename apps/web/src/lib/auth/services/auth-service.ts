import { authClient } from '@web/lib/clients';
import posthog from 'posthog-js';

/**
 * Service provides authentication methods using Better Auth
 *
 * This service:
 * - Exposes methods for authentication (sign in, sign out, OAuth)
 * - Handles errors with the handleAuthError utility
 * - Logs actions with the logger
 * - Does NOT manage auth state (that's handled by Better Auth hooks)
 * - Does NOT manage loading state (that's handled by the component using this service)
 */
export const authService = () => {
  /**
   * Helper to build fetchOptions with captcha token
   */
  const buildFetchOptions = (captchaToken?: string) => {
    return captchaToken
      ? {
          headers: {
            'x-captcha-response': captchaToken,
          },
        }
      : undefined;
  };

  /**
   * Sign in with OTP (magic link)
   * @param email User's email address
   * @param redirectTo URL to redirect after authentication
   * @param captchaToken Optional captcha token for bot protection
   */
  const signInWithMagicLink = async (
    email: string,
    redirectTo: string = '/dashboard',
    captchaToken?: string,
  ) => {
    try {
      console.info(`Sending OTP to ${email}`);

      const { error } = await authClient.signIn.magicLink({
        email,
        callbackURL: redirectTo,
        fetchOptions: buildFetchOptions(captchaToken),
      });

      if (error)
        throw error;

      console.info('OTP sent successfully');
      return { success: true, message: 'Check your email for the sign-in link' };
    }
    catch (error) {
      console.error('Magic link sign in failed:', { error: (error as Error).message });
      return { success: false, message: 'Failed to send sign-in link. Please try again.' };
    }
  };

  /**
   * Sign in with OAuth provider
   * @param provider OAuth provider ('google' | 'apple')
   * @param redirectTo Optional URL to redirect to after authentication
   */
  const signInWithOAuth = async (provider: 'google' | 'apple', redirectTo?: string) => {
    try {
      console.info(`Attempting to sign in with OAuth: ${provider}`);

      await authClient.signIn.social({
        provider,
        callbackURL: redirectTo || '/dashboard',
      });

      console.info(`OAuth sign-in with ${provider} initiated`);
      return { success: true };
    }
    catch (error) {
      console.error(`OAuth sign in failed for ${provider}:`, { error: (error as Error).message });
      return { success: false, message: 'Sign-in failed. Please try again.' };
    }
  };

  /**
   * Sign out the current user
   */
  const signOut = async () => {
    try {
      console.info('Signing out user');

      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            // Handle post-signout navigation in the component
            console.info('User signed out successfully');
          },
        },
      });

      // Reset PostHog to clear user identification
      posthog.reset();
      console.debug('PostHog user identification cleared');

      return { success: true };
    }
    catch (error) {
      console.error('Sign out failed:', { error: (error as Error).message });
      return { success: false, message: 'Sign out failed. Please try again.' };
    }
  };

  return {
    signInWithMagicLink,
    signInWithOAuth,
    signOut,
  };
};
