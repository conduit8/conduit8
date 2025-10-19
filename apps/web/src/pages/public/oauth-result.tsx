import { CheckIcon, XIcon } from '@phosphor-icons/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@web/ui/components/layout';

import { Button } from '@web/ui/components/atoms/buttons/button';

interface OAuthResultProps {
  status: 'success' | 'failed';
  platform: 'slack' | 'discord';
  workspaceName?: string;
  teamId?: string;
  botUserId?: string;
}

export const OAuthResultPage = ({ status, platform, workspaceName, teamId, botUserId }: OAuthResultProps) => {
  const isSuccess = status === 'success';
  const platformName = platform === 'slack' ? 'Slack' : 'Discord';

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${isSuccess ? 'bg-success-muted' : 'bg-destructive-muted'}`}>
            {isSuccess
              ? (
                  <CheckIcon className="h-8 w-8 text-success" weight="bold" />
                )
              : (
                  <XIcon className="h-8 w-8 text-destructive" weight="bold" />
                )}
          </div>
          <CardTitle>
            {isSuccess
              ? `${platformName} installation Successful`
              : 'Installation'
                + ' Failed'}
          </CardTitle>
          <CardDescription>
            {isSuccess
              ? (
                  <>
                    Conduit8 has been installed to
                    {' '}
                    <span className="font-medium">{workspaceName}</span>
                    {' '}
                    workspace
                  </>
                )
              : (
                  `We couldn't add Conduit8 to your workspace - try reinstalling. If the problem persists, contact support.`
                )}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {isSuccess && (
            <div className="rounded-md bg-muted p-4">
              <h4 className="mb-3 text-center font-medium">What's next?</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>1. Find Conduit8 bot in your Apps</p>
                <p>2. Send a direct message or click "New Chat"</p>
                <p>3. Use Conduit8 on the go!</p>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-3">
            {isSuccess
              ? (
                  <Button asChild className="hover:no-underline" variant="accent">
                    <a href={teamId && botUserId
                      ? `slack://user?team=${teamId}&id=${botUserId}`
                      : 'slack://open'}
                    >
                      Open DM with Conduit8
                    </a>
                  </Button>
                )
              : (
                  <Button asChild className="hover:no-underline">
                    <a href={`https://slack.com/oauth/v2/authorize?client_id=${platform === 'slack' ? '6959503069491.9140053645266' : ''}&scope=assistant:write,chat:write,commands,im:history,im:write,incoming-webhook,users.profile:read,users:write&user_scope=`}>
                      Re-install
                    </a>
                  </Button>
                )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
