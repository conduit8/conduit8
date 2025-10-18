import {
  authRoutes,
  avatarRoutes,
  healthRoutes,
  slackEventsRoutes,
  slackInteractionsRoutes,
  slackOAuthRoutes,
} from '@worker/entrypoints/api/routes';
import { Hono } from 'hono';

import type { AppContext } from '@worker/entrypoints/api/types/context';

import { extractAuth } from '@worker/entrypoints/api/middleware/auth.middleware';
import { globalCors } from '@worker/entrypoints/api/middleware/cors.middleware';
import { errorHandler } from '@worker/entrypoints/api/middleware/error.middleware';

export const app = new Hono<AppContext>();

// Mount middleware
app.use('*', globalCors);
app.use('*', extractAuth);

// Mount auth routes (handles /auth/*)
app.route('', authRoutes);

// Mount api routes (handles /api/v1/*)
app.route('', slackOAuthRoutes);
app.route('', slackEventsRoutes);
app.route('', slackInteractionsRoutes);
app.route('', healthRoutes);
app.route('', avatarRoutes);

// Set error handler
app.onError(errorHandler);
