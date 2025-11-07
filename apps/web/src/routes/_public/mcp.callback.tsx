import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { McpCallbackPage } from '@web/pages/public/mcp-callback';

const mcpCallbackSearchSchema = z.object({
  code: z.string().optional(),
  state: z.string().optional(),
  error: z.string().optional(),
  error_description: z.string().optional(),
});

export const Route = createFileRoute('/_public/mcp/callback')({
  validateSearch: mcpCallbackSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useSearch();

  return <McpCallbackPage {...params} />;
}
