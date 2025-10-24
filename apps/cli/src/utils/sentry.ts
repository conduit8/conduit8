/**
 * Sentry error tracking integration
 * Anonymous telemetry for CLI error reporting
 */
import * as Sentry from '@sentry/node';

// Baked-in Sentry DSN for conduit8 CLI
const SENTRY_DSN = 'https://71dd4338494f7b7f6e703157d928b07b@o4508393623257088.ingest.us.sentry.io/4510234614628352';

/**
 * Initialize Sentry for error tracking
 * @param telemetryEnabled - Whether telemetry is enabled (default: true)
 */
export function initSentry(telemetryEnabled: boolean = true): void {
  // Skip initialization if telemetry disabled
  if (!telemetryEnabled) {
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: 'production',

    // CLI-specific settings
    shutdownTimeout: 5000, // 5s for CLI reliability (default 2s may be too low)

    // Sample rates
    tracesSampleRate: 0, // No performance tracing for CLI
    sampleRate: 1.0, // Capture all errors (CLI has low volume)

    // Privacy: No PII
    sendDefaultPii: false,

    // Set release for better error grouping
    release: `conduit8@${__VERSION__}`,

    // Attach breadcrumbs for CLI operations
    beforeSend(event) {
      // Remove any potential PII from event
      if (event.request) {
        delete event.request.cookies;
        delete event.request.headers;
      }

      return event;
    },
  });
}

/**
 * Check if Sentry is enabled
 */
export function isSentryEnabled(): boolean {
  return Sentry.isEnabled();
}

/**
 * Manually capture an exception (for non-automatic cases)
 */
export function captureException(error: Error): void {
  if (Sentry.isEnabled()) {
    Sentry.captureException(error);
  }
}

/**
 * Add breadcrumb for CLI operation
 */
export function addBreadcrumb(message: string, data?: Record<string, unknown>): void {
  if (Sentry.isEnabled()) {
    Sentry.addBreadcrumb({
      message,
      level: 'info',
      data,
    });
  }
}

/**
 * Flush Sentry events before exit
 * Critical for CLI to ensure events are sent
 */
export async function flushSentry(): Promise<void> {
  if (Sentry.isEnabled()) {
    await Sentry.close(5000); // 5s timeout
  }
}
