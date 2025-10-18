import { WarningCircleIcon } from '@phosphor-icons/react';
import { Button } from '@web/ui/components/atoms/buttons';

import { UnstyledLink } from '@web/ui/components/navigation/unstyled-link';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
}

export function ErrorFallback({ error: _error, resetError }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <WarningCircleIcon className="text-destructive h-12 w-12" />

      <p className="font-bold">Something went wrong</p>

      <small className="text-muted-foreground text-sm">
        An unexpected error occurred. Please try refreshing the page.
      </small>

      <div className="flex gap-2">
        {resetError && (
          <Button variant="secondary" onClick={resetError}>
            Try Again
          </Button>
        )}

        <Button variant="secondary" asChild>
          <UnstyledLink to="/">Back to Home</UnstyledLink>
        </Button>
      </div>
    </div>
  );
}
