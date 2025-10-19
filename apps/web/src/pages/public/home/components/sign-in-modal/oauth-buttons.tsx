import { Button } from '@web/ui/components/atoms/buttons';
import { Loader2 } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';

import { cn } from '@web/lib/utils/tailwind-utils';

interface OAuthButtonsProps {
  className?: string;
  onGitHubSignIn?: () => void;
  onGoogleSignIn?: () => void;
  loadingProvider?: 'github' | 'google';
}

export function OAuthButtons({
  className,
  onGitHubSignIn,
  onGoogleSignIn,
  loadingProvider,
}: OAuthButtonsProps) {
  const isGitHubLoading = loadingProvider === 'github';
  const isGoogleLoading = loadingProvider === 'google';
  const isAnyLoading = !!loadingProvider;

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <Button
        variant="outline"
        className="justify-left flex w-full items-center"
        onClick={onGitHubSignIn}
        disabled={isAnyLoading}
      >
        {isGitHubLoading ? <Loader2 className="size-4 animate-spin" /> : <FaGithub className="size-5" />}
        Continue with GitHub
      </Button>
      <Button
        variant="outline"
        className="justify-left flex w-full items-center"
        onClick={onGoogleSignIn}
        disabled={isAnyLoading}
      >
        {isGoogleLoading ? <Loader2 className="size-4 animate-spin" /> : <FcGoogle className="size-5" />}
        Continue with Google
      </Button>
    </div>
  );
}
