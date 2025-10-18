/// <reference types="../worker-configuration.d.ts" />
import * as Sentry from '@sentry/cloudflare';
import { app, queue, scheduled } from '@worker/entrypoints';

// Re-export the Durable Object classes for Cloudflare Workers
export { RateLimiterDO } from '@worker/infrastructure/persistence/durable-objects';
export { ClaudeRuntime } from '@worker/infrastructure/runtime';

export default Sentry.withSentry(
  env => ({
    dsn: env.SENTRY_DSN,
    release: env.SENTRY_RELEASE,
    environment: env.ENV,
    sendDefaultPii: true,
    enableLogs: true,
    tracesSampleRate: env.ENV === 'production' ? 1.0 : 0.1,
  }),
  {
    fetch: app.fetch,
    scheduled,
    queue,
  } satisfies ExportedHandler<Env>,
);
