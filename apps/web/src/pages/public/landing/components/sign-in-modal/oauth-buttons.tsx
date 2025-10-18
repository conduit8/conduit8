import { Button } from '@web/ui/components/atoms/buttons';
import { Loader2 } from 'lucide-react';
import { FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { cn } from '@web/lib/utils/tailwind-utils';

interface OAuthButtonsProps {
  className?: string;
  onAppleSignIn?: () => void;
  onGoogleSignIn?: () => void;
  loadingProvider?: 'apple' | 'google';
}

export function OAuthButtons({
  className,
  onAppleSignIn,
  onGoogleSignIn,
  loadingProvider,
}: OAuthButtonsProps) {
  const isAppleLoading = loadingProvider === 'apple';
  const isGoogleLoading = loadingProvider === 'google';
  const isAnyLoading = !!loadingProvider;

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <Button
        variant="outline"
        className="justify-left flex w-full items-center"
        onClick={onAppleSignIn}
        disabled={isAnyLoading}
      >
        {isAppleLoading ? <Loader2 className="size-4 animate-spin" /> : <FaApple className="size-6" />}
        Continue with Apple
      </Button>
      <Button
        variant="outline"
        className="justify-left flex w-full items-center"
        onClick={onGoogleSignIn}
        disabled={isAnyLoading}
      >
        {isGoogleLoading ? <Loader2 className="size-4 animate-spin" /> : <FcGoogle className="size-6" />}
        Continue with Google
      </Button>
    </div>
  );
}
