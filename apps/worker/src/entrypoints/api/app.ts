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

// Temporary test route for email diagnostics
app.get('/test-email', async (c) => {
  const { ResendEmailService } = await import('@worker/infrastructure/services/email/resend-email-service');
  const emailService = ResendEmailService.create(c.env);

  await emailService.sendEmail({
    to: 'test-kfl2i4h7x@srv1.mail-tester.com',
    subject: 'Conduit8 Email Deliverability Test',
    html: '<h1>Test Email</h1><p>This is a test email to check deliverability.</p>',
    text: 'Test Email\n\nThis is a test email to check deliverability.',
  });

  return c.json({ success: true, message: 'Test email sent' });
});

// Set error handler
app.onError(errorHandler);
