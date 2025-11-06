import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { McpConsentPage } from '@web/pages/public/mcp-consent';

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
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useSearch();

  return <McpConsentPage {...params} />;
}
