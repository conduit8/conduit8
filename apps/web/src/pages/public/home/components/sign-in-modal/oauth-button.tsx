import { Button } from '@web/ui/components/atoms/buttons';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { FaGithub } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';

import { cn } from '@web/lib/utils/tailwind-utils';

interface OAuthButtonProps {
  provider: 'github' | 'google';
  onSubmit: () => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export function OAuthButton({
  provider,
  onSubmit,
  disabled = false,
  className,
}: OAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onSubmit();
      // Keep loading state - OAuth redirect will unmount component
    }
    catch {
      // Parent handles error toast, keep loading until redirect or error
    }
  };

  const isGitHub = provider === 'github';
  const icon = isLoading
    ? <Loader2 className="size-4 animate-spin" />
    : isGitHub
      ? <FaGithub className="size-5" />
      : <FcGoogle className="size-5" />;

  const label = isGitHub ? 'Continue with GitHub' : 'Continue with Google';

  return (
    <Button
      variant="outline"
      className={cn('justify-left flex w-full items-center', className)}
      onClick={handleClick}
      disabled={disabled || isLoading}
    >
      {icon}
      {label}
    </Button>
  );
}
