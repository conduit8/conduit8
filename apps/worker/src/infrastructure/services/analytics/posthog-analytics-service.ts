import { PostHog } from 'posthog-node';

import type { IAnalyticsService } from '@worker/infrastructure/services/interfaces';

/**
   * PostHog analytics client for Cloudflare Workers
   *
   * Uses a simple queue + flush pattern for all events.
   * Events are queued with capture() and must be flushed with shutdown().
   *
   * ## Usage Patterns
   *
   * ### In API Routes (with Hono context):
   * ```typescript
   * const posthog = new PostHogAnalyticsService(c.env);
   * posthog.capture('event_name', userId, { property: 'value' });
   * c.executionCtx.waitUntil(posthog.shutdown()); // Non-blocking flush
   * ```
   *
   * ### In Queue Handlers (no context):
   * ```typescript
   * const posthog = new PostHogAnalyticsService(env);
   * posthog.capture('event_name', userId, { property: 'value' });
   * await posthog.shutdown(); // Blocking flush before handler ends
   * ```

   * ```
   */
export class PostHogAnalyticsService implements IAnalyticsService {
  private client: PostHog | null;

  constructor(env: Env) {
    this.client = new PostHog(env.POSTHOG_API_KEY, {
      host: env.POSTHOG_HOST,
      flushAt: 1, // Send events immediately (low batching threshold)
      flushInterval: 0, // Don't wait for time-based flush
    });
  }

  /**
     * Queue an analytics event (non-blocking).
     * Must call shutdown() to ensure delivery.
     *
     * @param event - Event name (e.g. 'user_signed_up', 'trial_used')
     * @param distinctId - Unique user identifier
     * @param properties - Optional event properties
     */
  track(
    event: string,
    distinctId: string,
    properties?: Record<string, any>,
  ): void {
    this.client!.capture({
      distinctId,
      event,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
     * Flush all queued events to PostHog.
     *
     * - In API routes: Use with c.executionCtx.waitUntil() for non-blocking
     * - In queue handlers: Use with await for blocking flush
     */
  async shutdown(): Promise<void> {
    try {
      await this.client!.shutdown();
    }
    catch (error) {
      console.error('[PostHog] Error flushing events:', error);
    }
  }
}
