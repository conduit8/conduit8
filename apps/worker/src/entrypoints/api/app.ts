import {
  authRoutes,
  avatarRoutes,
  githubRoutes,
  healthRoutes,
  skillsRoutes,
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
app.route('', githubRoutes);
app.route('', healthRoutes);
app.route('', avatarRoutes);
app.route('', skillsRoutes);

// Set error handler
app.onError(errorHandler);
