import type { AppContext } from '@mcp/entrypoints/api/types';

import { Hono } from 'hono';

import { globalCors } from '@mcp/entrypoints/api/middleware/cors.middleware';
import { errorHandler } from '@mcp/entrypoints/api/middleware/error.middleware';
import oauthRoutes from '@mcp/entrypoints/api/routes/oauth.routes';

export const app = new Hono<AppContext>();

// Apply CORS middleware
app.use('*', globalCors);

// Mount OAuth routes
app.route('/', oauthRoutes);

// Set error handler
app.onError(errorHandler);
