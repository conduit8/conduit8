import type { BaseCommand, BaseEvent, BaseMessage, BaseQuery, CommandName, EventName, QueryName } from '@worker/domain/messages';

import type { IQueueService } from '@worker/infrastructure/services/interfaces';

import { isCommand, isEvent, isQuery } from '@worker/domain/messages/base';
import { CloudflareQueueService } from '@worker/infrastructure/services/queue/cloudflare-queue-service';

import { COMMAND_HANDLERS, EVENT_HANDLERS, QUERY_HANDLERS } from './handlers/registry';

/**
 * MessageBus - Central message processing system
 *
 * Key differences from pure CQRS:
 * - Commands can return results (pragmatic approach)
 * - Events are retried with exponential backoff
 * - All handlers imported statically from registry
 *
 * TODO: DDD IMPROVEMENT - This message bus should handle domain events collected from aggregates
 * Currently events are being manually created and sent to queues
 * Should be: Commands -> Aggregates -> Domain Events -> MessageBus -> Side Effects/Queues
 */
export class MessageBus {
  private queue: BaseMessage[] = [];
  private queueService: IQueueService;

  constructor(private readonly env: Env) {
    this.queueService = new CloudflareQueueService(env);
  }

  /**
   * Main entry point - processes message and all resulting events
   * Returns:
   * - For queries: the direct query result
   * - For commands: result from processed command and events
   * - For events: events
   */
  async handle(message: BaseMessage, env: Env): Promise<any> {
    this.queue = [message];
    let commandResult: any;

    while (this.queue.length > 0) {
      const msg = this.queue.shift()!;

      if (isCommand(msg)) {
        // Store result but continue processing events
        // TODO: Refactor to more pure CQRS -> commands should not return anything
        commandResult = await this.handleCommand(msg, env);
      }
      else if (isEvent(msg)) {
        await this.handleEvent(msg, env);
      }
      else if (isQuery(msg)) {
        // Queries do not produce events
        return await this.handleQuery(msg, env);
      }
      else {
        throw new Error(`Unknown message type: ${JSON.stringify(msg)}`);
      }
    }

    // Return command result after all events processed
    return commandResult;
  }

  /**
   * Handle a command - exactly one handler, returns result + events
   */
  private async handleCommand(
    command: BaseCommand,
    env: Env,
  ): Promise<any> {
    const handler = COMMAND_HANDLERS[command.name as CommandName] as any;

    if (!handler) {
      throw new Error(`No handler for command ${command.name}`);
    }

    try {
      console.log(`Handling command ${command.name}`);
      const { result, events } = await handler(command, env);

      // Add any produced events to the queue
      console.debug(`Produced ${events.length} events`);

      // All async events go to the queue, all sync are processed immediately
      // TODO: Both command and event handlers should be able to produce events
      // Key rule: domain models raise events not handlers
      for (const event of events) {
        if (event.async) {
          await this.queueService.send(event);
        }
        else {
          this.queue.push(event);
        }
      }

      return result;
    }
    catch (error) {
      console.error(`Error handling command ${command.name}:`, error);
      throw error; // Commands should fail loudly
    }
  }

  /**
   * Handle an event - multiple handlers, with retry logic
   */
  private async handleEvent(
    event: BaseEvent,
    env: Env,
  ): Promise<void> {
    const handlers = (EVENT_HANDLERS[event.name as EventName] || []) as any;

    for (const handler of handlers) {
      await this.retryHandler(
        () => handler(event, env),
        `event ${event.name}`,
        3, // max attempts
      );
      // TODO: Event handlers should also be able to produce events
      // Currently they return void, should collect events from modified aggregates
    }
  }

  /**
   * Handle a query - exactly one handler, read-only
   */
  private async handleQuery(
    query: BaseQuery,
    env: Env,
  ): Promise<any> {
    const handler = QUERY_HANDLERS[query.name as QueryName] as any;

    if (!handler) {
      throw new Error(`No handler for query ${query.name}`);
    }

    try {
      console.log(`Handling query ${query.name}`);
      return await handler(query, env);
    }
    catch (error) {
      console.error(`Error handling query ${query.name}:`, error);
      throw error; // Queries should fail loudly
    }
  }

  /**
   * Retry logic with exponential backoff
   */
  private async retryHandler(
    fn: () => Promise<any>,
    description: string,
    maxAttempts: number = 3,
  ): Promise<void> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`Handling ${description} (attempt ${attempt}/${maxAttempts})`);
        await fn();
        return; // Success!
      }
      catch (error) {
        lastError = error as Error;
        console.error(`Attempt ${attempt} failed for ${description}:`, error);

        if (attempt < maxAttempts) {
          // Exponential backoff: 100ms, 200ms, 400ms...
          const delay = 2 ** (attempt - 1) * 100;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // All attempts failed
    console.error(`Failed to handle ${description} after ${maxAttempts} attempts:`, lastError);
    // Don't throw - event handlers should not stop other events from processing
  }
}
