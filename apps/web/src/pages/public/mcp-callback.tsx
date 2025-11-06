import { CheckIcon, XIcon } from '@phosphor-icons/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@web/ui/components/layout';
import { useEffect } from 'react';

import { Button } from '@web/ui/components/atoms/buttons/button';

interface McpCallbackPageProps {
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
}

export const McpCallbackPage = ({ code, state, error, error_description }: McpCallbackPageProps) => {
  const isSuccess = !!code && !error;
  const isError = !!error;

  useEffect(() => {
    // Auto-close window after successful auth (MCP client should be listening)
    if (isSuccess) {
      const timer = setTimeout(() => {
        window.close();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive-muted">
              <XIcon className="h-8 w-8 text-destructive" weight="bold" />
            </div>
            <CardTitle>Authorization Failed</CardTitle>
            <CardDescription>
              {error === 'access_denied'
                ? 'You denied access to the MCP client.'
                : error_description || 'An error occurred during authorization.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-sm text-muted-foreground">
              You can close this window and try again.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-muted">
            <CheckIcon className="h-8 w-8 text-success" weight="bold" />
          </div>
          <CardTitle>Authorization Successful</CardTitle>
          <CardDescription>
            You've successfully authorized the MCP client to access your Conduit8 skills.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="rounded-md bg-muted p-4 text-center text-sm">
            This window will close automatically...
          </div>
          <Button onClick={() => window.close()} variant="outline" className="hover:no-underline">
            Close Window
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
