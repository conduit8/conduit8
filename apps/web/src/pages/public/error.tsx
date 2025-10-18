import { CheckIcon, CopyIcon, WarningCircleIcon } from '@phosphor-icons/react';
import { useState } from 'react';

import { Button } from '@web/ui/components/atoms/buttons/button';

interface ErrorFallbackProps {
  error?: Error;
  info?: { componentStack?: string };
  reset?: () => void;
}

export const UnhandledErrorPage = ({ error, reset }: ErrorFallbackProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (error) {
      const errorText = `${error.name}: ${error.message}\n\nStack trace:\n${error.stack}`;
      navigator.clipboard.writeText(errorText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="bg-card w-full max-w-xl rounded-lg p-8 shadow-lg">
        <div className="mb-6 flex justify-center">
          {/* Error icon with destructive styling */}
          <div className="bg-destructive/20 border-destructive/50 shadow-destructive/10 flex h-16 w-16 items-center justify-center rounded-full border shadow-lg">
            <WarningCircleIcon className="text-destructive h-8 w-8" weight="regular" />
          </div>
        </div>

        <h1 className="text-foreground mb-4 text-2xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">
          We're sorry, but something unexpected happened. Please try refreshing the page.
        </p>

        {/* Show error details in development */}
        {import.meta.env.DEV && error && (
          <div className="bg-destructive/10 text-foreground border-destructive/30 relative mb-6 overflow-auto rounded border p-4 text-left">
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2"
              onClick={handleCopy}
            >
              {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
            </Button>
            <p className="pr-10 font-bold">
              {error.name}
              :
              {error.message}
            </p>
            <details className="mt-2">
              <summary className="cursor-pointer text-sm">View stack trace</summary>
              <pre className="mt-2 whitespace-pre-wrap text-xs">{error.stack}</pre>
            </details>
          </div>
        )}

        <div className="flex flex-col space-y-2">
          {reset && (
            <Button variant="default" className="w-full" onClick={reset}>
              Try again
            </Button>
          )}
          <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
            Reload page
          </Button>
          <Button variant="outline" className="w-full" onClick={() => (window.location.href = '/')}>
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
};
