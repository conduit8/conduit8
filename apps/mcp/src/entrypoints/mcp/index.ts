import OAuthProvider from '@cloudflare/workers-oauth-provider';

import { OAuthRoutes } from './routes';
import { Conduit8MCP } from './server';

export default new OAuthProvider({
  apiHandlers: {
    '/mcp': Conduit8MCP.serve('/mcp'),
    '/sse': Conduit8MCP.serveSSE('/sse'),
  },
  authorizeEndpoint: '/authorize',
  tokenEndpoint: '/token',
  clientRegistrationEndpoint: '/register',
  defaultHandler: OAuthRoutes as any,
});
