import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { OAuthResultPage } from '@web/pages/public/oauth-result';

const oauthSearchSchema = z.object({
  status: z.enum(['success', 'failed']),
  platform: z.enum(['slack', 'discord']),
  workspace: z.string().optional(),
  teamId: z.string().optional(),
  botUserId: z.string().optional(),
});

export const Route = createFileRoute('/_public/oauth')({
  validateSearch: oauthSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { status, platform, workspace, teamId, botUserId } = Route.useSearch();

  return (
    <OAuthResultPage
      status={status}
      platform={platform}
      workspaceName={workspace}
      teamId={teamId}
      botUserId={botUserId}
    />
  );
}
