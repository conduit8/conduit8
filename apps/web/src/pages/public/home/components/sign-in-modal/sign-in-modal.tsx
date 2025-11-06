import { Link } from '@tanstack/react-router';
import { settings } from '@web/lib/settings';
import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';

import type { EmailFormValues } from '@web/pages/public/home/components/sign-in-modal/sign-in-form';

import { authService } from '@web/lib/auth/services/auth-service';
import { SignInForm } from '@web/pages/public/home/components/sign-in-modal/sign-in-form';
import { Logo } from '@web/ui/components/atoms/brand/logo';
import { Divider } from '@web/ui/components/layout/dividers/divider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@web/ui/components/overlays/dialog';
import { TurnstileWidget } from '@web/ui/components/security/turnstile-widget';

import { OAuthButton } from './oauth-button';

// TODO:
// Make buttons bigga!
// Disable ONLY the button that is pressed (not all)
// Send toast "Signing in via X with timeout"

/**
 * LoginModal - Container component that handles authentication logic
 *
 * This component:
 * 1. Manages authentication state
 * 2. Handles form submissions and OAuth requests
 * 3. Composes the UI components (AuthCard, OAuthButtons, EmailForm)
 */
export function SignInModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [loadingMethod, setLoadingMethod] = React.useState<
    'github' | 'google' | 'email' | null
  >(null);
  const { signInWithMagicLink, signInWithOAuth } = authService();
  const [turnstileToken, setTurnstileToken] = useState('');

  const handleGitHubSignIn = useCallback(async (): Promise<void> => {
    setLoadingMethod('github');
    try {
      console.info('GitHub sign in');
      const redirectUrl = localStorage.getItem('auth_redirect') || `/`;
      await signInWithOAuth('github', redirectUrl);
      // Keep loading state - redirect will unmount component
    }
    catch {
      toast.error('Failed to sign in with GitHub - please try again.');
      setLoadingMethod(null); // Only clear on error
    }
  }, [signInWithOAuth]);

  const handleGoogleSignIn = useCallback(async (): Promise<void> => {
    setLoadingMethod('google');
    try {
      console.info('Google sign in');
      const redirectUrl = localStorage.getItem('auth_redirect') || `/`;
      await signInWithOAuth('google', redirectUrl);
      // Keep loading state - redirect will unmount component
    }
    catch {
      toast.error('Failed to sign in with Google - please try again');
      setLoadingMethod(null); // Only clear on error
    }
  }, [signInWithOAuth]);

  const handleEmailSubmit = useCallback(
    async (data: EmailFormValues): Promise<void> => {
      setLoadingMethod('email');
      try {
        const redirectUrl = localStorage.getItem('auth_redirect') || `${settings.site.url}/`;
        const result = await signInWithMagicLink(
          data.email,
          redirectUrl,
          turnstileToken,
        );
        if (result.success) {
          toast.info(
            `Check your email - we've sent a sign in link to ${data.email}`,
          );
        }
        else {
          toast.error('Failed to send a sign in link - please try again');
        }
      }
      catch (error: unknown) {
        console.error('Error occured during sign in:', error);
        toast.error('Failed to send a sign in link - please try again');
      }
      finally {
        setLoadingMethod(null);
      }
    },
    [signInWithMagicLink, turnstileToken],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="component-width-card justify-center gap-6">
        <DialogHeader className="sm:text-center">
          <DialogTitle className="flex justify-center">
            <Logo interactive={false} variant="icon" />
          </DialogTitle>
          <DialogDescription className="mt-4">
            Sign in via OAuth
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <OAuthButton
            provider="github"
            onSubmit={handleGitHubSignIn}
            disabled={loadingMethod !== null && loadingMethod !== 'github'}
          />
          <OAuthButton
            provider="google"
            onSubmit={handleGoogleSignIn}
            disabled={loadingMethod !== null && loadingMethod !== 'google'}
          />
        </div>
        <Divider text="Sign in via email" />
        <SignInForm
          onSubmit={handleEmailSubmit}
          isLoading={loadingMethod === 'email'}
          disabled={loadingMethod === 'github' || loadingMethod === 'google'}
        />
        <small className="text-muted-foreground text-center">
          By signing in, you agree to our
          {' '}
          <Link to="/terms" className="hover:underline">
            Terms of Service
          </Link>
          {' '}
          and
          {' '}
          <Link to="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          .
        </small>
        <div className="flex justify-center">
          <TurnstileWidget onTokenChange={setTurnstileToken} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
