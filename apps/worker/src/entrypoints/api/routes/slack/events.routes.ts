import type { SlackEventPayload } from '@kollektiv/core';
import type { BaseCommand } from '@worker/domain/messages';

import { APP_ROUTES } from '@kollektiv/core';
import { Hono } from 'hono';

import type { AppContext } from '@worker/entrypoints/api/types/context';

import {
  ProcessThreadContextChanged,
  ProcessThreadStarted,
  ProcessUserMessage,
  UpdateAppHome,
} from '@worker/domain/messages/commands';
import { CloudflareQueueService } from '@worker/infrastructure/services/queue/cloudflare-queue-service';

const app = new Hono<AppContext>().basePath(APP_ROUTES.api.prefix);

// Apply middleware chain for events route
app.use(
  APP_ROUTES.api.slack.events,
);

/**
 * Mapper function: Converts Slack events to domain commands
 * Lives at the route level since it's mapping API layer to domain layer
 *
 * @param outerEvent - The Slack event payload from the API (already verified it's not url_verification)
 * @returns Domain command or null if event should be ignored
 */
function createCommandFromSlackEvent(outerEvent: Exclude<SlackEventPayload, { type: 'url_verification' }>): BaseCommand | null {
  const eventType = outerEvent.event.type;
  const teamId = outerEvent.team_id;

  // Map each event type to its corresponding command
  switch (eventType) {
    case 'assistant_thread_started': {
      const userId = outerEvent.event.assistant_thread.user_id;
      const channel = outerEvent.event.assistant_thread.channel_id;
      const threadTs = outerEvent.event.assistant_thread.thread_ts;

      return new ProcessThreadStarted(teamId, userId, channel, threadTs);
    }

    case 'assistant_thread_context_changed': {
      const userId = outerEvent.event.assistant_thread.user_id;
      const channel = outerEvent.event.assistant_thread.channel_id;
      const threadTs = outerEvent.event.assistant_thread.thread_ts;

      // TODO: Handler implementation needed
      console.log('Thread context changed - handler not yet implemented', {
        userId,
        channel,
        threadTs,
        teamId,
      });

      return new ProcessThreadContextChanged(teamId, userId, channel, threadTs);
    }

    case 'app_home_opened': {
      const userId = outerEvent.event.user;
      return new UpdateAppHome(teamId, userId);
    }

    case 'message': {
      const event = outerEvent.event;

      // Only process regular user messages (no subtype)
      // This filters out bot_message, message_changed, channel events, etc.
      if (event.subtype !== undefined) {
        console.log(`Skipping ${event.subtype} message`, {
          channel: event.channel,
        });
        return null;
      }

      // Additional check for bot messages without subtype
      if (event.bot_id) {
        console.log('Skipping bot_add message', { channel: event.channel });
        return null;
      }

      return new ProcessUserMessage(
        teamId,
        event.user!,
        event.channel!,
        event.text,
        event.thread_ts,
      );
    }

    // TODO: Handle app_mention event - this is a bigger feature that would allow
    // Kollektiv to work in different contexts (channels, threads) when @mentioned.
    // Currently Kollektiv only responds to direct messages and assistant threads.
    // See: https://api.slack.com/events/app_mention
    // case 'app_mention': {
    //   const userId = outerEvent.event.user;
    //   const channel = outerEvent.event.channel;
    //   const threadTs = outerEvent.event.thread_ts || outerEvent.event.ts;
    //   // Would need to handle mentions in channels/threads differently
    //   break;
    // }

    default:
      // Log unhandled event types for debugging
      console.log('Unhandled event type', { eventType });
      return null;
  }
}

// NEW IMPLEMENTATION - Command-based with queue
app.post(APP_ROUTES.api.slack.events, async (c) => {
  try {
    const startTime = Date.now();
    const outerEvent = await c.req.json() as SlackEventPayload;

    // Handle URL verification challenge (not an actual event)
    if (outerEvent.type === 'url_verification') {
      console.log('URL verification challenge received');
      return c.json({ challenge: outerEvent.challenge });
    }

    // Common event context for all events (preserved from old implementation)
    const eventContext = {
      type: outerEvent.event.type,
      team_id: outerEvent.team_id,
      event_id: outerEvent.event_id,
      event_time: outerEvent.event_time,
      retry_num: c.req.header('X-Slack-Retry-Num'),
      retry_reason: c.req.header('X-Slack-Retry-Reason'),
      is_retry: !!c.req.header('X-Slack-Retry-Num'),
      receive_time_ms: startTime,
    };

    console.log('Slack event received', eventContext);

    // Convert Slack event to domain command
    const command = createCommandFromSlackEvent(outerEvent);

    if (!command) {
      // Event was filtered out or not handled
      return c.text('ok', 200);
    }

    // Send command to queue for processing
    const queueService = new CloudflareQueueService(c.env);

    // Use waitUntil to send to queue without blocking response
    c.executionCtx.waitUntil(
      queueService.send(command),
    );

    // Single ACK point - ensures every event gets acknowledged to prevent Slack retries
    return c.text('ok', 200);
  }
  catch (e) {
    console.error('Unhandled error processing Slack event', e);
    // Tell Slack not to retry - we've logged the error and don't want duplicates
    return c.text('error', 500, {
      'X-Slack-No-Retry': '1',
    });
  }
});

export default app;
