import type { BaseCommand, BaseEvent } from '@worker/domain/messages';

import type { IQueueService } from '../interfaces';

// Extract ONLY Queue bindings from Env
export type QueueBindings = {
  [K in keyof Env]: Env[K] extends Queue<any> ? K : never
}[keyof Env];

/**
 * Event routing configuration
 * Maps domain event names to queue bindings
 */
const EVENT_QUEUE_ROUTING: Record<string, QueueBindings> = {
  // Billing events - high priority
  SubscriptionPurchased: 'PRIORITY_QUEUE',
  SubscriptionCancelled: 'PRIORITY_QUEUE',

  // File operations - background
  R2UploadCompleteNotification: 'BACKGROUND_QUEUE',

  // Slack events - background
  SlackAppInstalled: 'BACKGROUND_QUEUE',

  // Conversation events - background
  ConversationStarted: 'BACKGROUND_QUEUE',
  ConversationTurnStarted: 'BACKGROUND_QUEUE',
  ConversationTurnCompleted: 'BACKGROUND_QUEUE',
  SessionRestoreRequired: 'BACKGROUND_QUEUE',

  // User events - background
  UserConfigured: 'BACKGROUND_QUEUE',
  UserConfigurationUpdated: 'BACKGROUND_QUEUE',
  UserConfigurationRequired: 'BACKGROUND_QUEUE',
};

/**
 * Default queue for events without explicit routing
 */
const DEFAULT_EVENT_QUEUE: QueueBindings = 'BACKGROUND_QUEUE';

/**
 * Cloudflare Queues implementation of IQueueService
 *
 * Wraps domain messages with queue metadata and routes to appropriate queues
 */
export class CloudflareQueueService implements IQueueService {
  constructor(private readonly env: Env) {}

  /**
   * Send a domain message to the appropriate queue
   * Automatically routes events based on event name, commands to priority queue
   *
   * @param message - Domain message (command or event)
   */
  async send(message: BaseEvent | BaseCommand): Promise<void> {
    // Get the appropriate queue for this message
    const queue = this.getQueueForMessage(message);

    // Wrap message with queue metadata
    const queueMessage = {
      version: 1,
      timestamp: new Date().toISOString(),
      payload: message,
    };

    // Send wrapped message
    await queue.send(queueMessage);
  }

  /**
   * Get the appropriate queue for a domain message
   * @throws Error if queue binding not found
   */
  private getQueueForMessage(message: BaseEvent | BaseCommand): Queue<any> {
    // Determine queue name based on message type
    let queueName: QueueBindings;

    if (message.type === 'event') {
      // Route events based on name
      queueName = EVENT_QUEUE_ROUTING[(message as BaseEvent).name] || DEFAULT_EVENT_QUEUE;
    }
    else {
      // Commands go to priority queue
      queueName = 'PRIORITY_QUEUE';
    }

    // Get queue from environment
    const queue = this.env[queueName] as Queue<any> | undefined;

    if (!queue) {
      throw new Error(
        `Queue binding '${queueName}' not found in environment. `
        + `Make sure it's defined in wrangler.jsonc`,
      );
    }

    return queue;
  }
}
