import * as Sentry from '@sentry/react';
import { router } from '@web/lib/router';
import { settings } from '@web/lib/settings';

// Initialize Sentry with TanStack Router integration
Sentry.init({
  dsn: settings.sentry.dsn,
  environment: settings.sentry.environment,
  integrations: [Sentry.tanstackRouterBrowserTracingIntegration(router)],
  sampleRate: settings.sentry.sampleRate,
  tracesSampleRate: settings.sentry.tracesSampleRate,
  tracePropagationTargets: [
    'localhost',
    '127.0.0.1:5173',
    /^https:\/\/kollektiv\.sh$/,
    /^https:\/\/.*\.kollektiv\.sh$/,
  ],
  profilesSampleRate: settings.sentry.profilesSampleRate,
  sendDefaultPii: false,
});

// Export the Sentry Error Boundary component for use in your app
export const ErrorBoundary = Sentry.ErrorBoundary;

// Export Sentry for manual error reporting
export { Sentry };
