import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';

import { McpConsentPage } from '@web/pages/public/mcp/mcp-consent';

const mcpConsentSearchSchema = z.object({
  client_id: z.string(),
  redirect_uri: z.url(),
  state: z.string(),
  code_challenge: z.string(),
  code_challenge_method: z.string(),
  scope: z.string().optional(),
});

export const Route = createFileRoute('/_public/mcp/consent')({
  validateSearch: mcpConsentSearchSchema,
  beforeLoad: ({ search }) => {
    const result = mcpConsentSearchSchema.safeParse(search);

    if (!result.success) {
      console.error('Invalid consent parameters - redirecting to home');
      throw redirect({ to: '/' });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useSearch();

  return <McpConsentPage {...params} />;
}
