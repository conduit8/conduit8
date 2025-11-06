import { CheckIcon, ShieldCheckIcon, XIcon } from '@phosphor-icons/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@web/ui/components/layout';
import { useState } from 'react';

import { Button } from '@web/ui/components/atoms/buttons/button';
import { Alert } from '@web/ui/components/feedback/alerts/alert';

interface McpConsentPageProps {
  client_id: string;
  redirect_uri: string;
  state: string;
  code_challenge: string;
  code_challenge_method: string;
  scope?: string;
}

export const McpConsentPage = ({
  client_id,
  redirect_uri,
  state,
  code_challenge,
  code_challenge_method,
  scope,
}: McpConsentPageProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAllow = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call MCP server to complete authorization
      const mcpUrl = redirect_uri.startsWith('http://localhost')
        ? 'http://localhost:8788' // Local MCP dev server
        : 'https://mcp.conduit8.dev'; // Production MCP server

      const response = await fetch(`${mcpUrl}/authorize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state, approved: true }),
      });

      if (!response.ok) {
        throw new Error('Authorization failed');
      }

      const data = await response.json() as { redirectTo: string };
      window.location.href = data.redirectTo;
    }
    catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleDeny = async () => {
    setIsLoading(true);

    try {
      const mcpUrl = redirect_uri.startsWith('http://localhost')
        ? 'http://localhost:8788'
        : 'https://mcp.conduit8.dev';

      const response = await fetch(`${mcpUrl}/authorize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state, approved: false }),
      });

      if (!response.ok) {
        throw new Error('Failed to deny authorization');
      }

      const data = await response.json() as { redirectTo: string };
      window.location.href = data.redirectTo;
    }
    catch (err) {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-muted">
            <ShieldCheckIcon className="h-8 w-8 text-accent" weight="bold" />
          </div>
          <CardTitle>Connect to Conduit8</CardTitle>
          <CardDescription>
            An MCP client is requesting access to execute Conduit8 skills
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {error && (
            <Alert variant="destructive">
              {error}
            </Alert>
          )}

          <div className="rounded-md bg-muted p-4">
            <h4 className="mb-3 font-medium">What this allows</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Execute Conduit8 skills from your MCP client</li>
              <li>• Skills run securely in Conduit8's sandbox environment</li>
              <li>• Your session remains private and encrypted</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleDeny}
              disabled={isLoading}
              variant="outline"
              className="flex-1 hover:no-underline"
            >
              <XIcon weight="bold" />
              Cancel
            </Button>
            <Button
              onClick={handleAllow}
              disabled={isLoading}
              className="flex-1 hover:no-underline"
              variant="accent"
            >
              <CheckIcon weight="bold" />
              {isLoading ? 'Connecting...' : 'Connect'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
