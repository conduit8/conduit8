/// <reference types="../worker-configuration.d.ts" />

import OAuthProvider from '@cloudflare/workers-oauth-provider';

import { Conduit8MCP } from '@mcp/application/server';
import { app } from '@mcp/entrypoints/api/app';

// Export Durable Object for wrangler binding
export { Conduit8MCP };

export default new OAuthProvider({
  apiHandlers: {
    '/mcp': Conduit8MCP.serve('/mcp'),
  },
  authorizeEndpoint: '/authorize',
  tokenEndpoint: '/token',
  clientRegistrationEndpoint: '/register',
  defaultHandler: {
    fetch: ((request: Request, env: unknown, ctx: ExecutionContext) =>
      app.fetch(request, env as Env, ctx)) as ExportedHandlerFetchHandler,
  },
});
