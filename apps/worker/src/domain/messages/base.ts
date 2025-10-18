/**
 * Base message types for our domain-driven message bus
 * These define the contract for all messages in the system
 */
import type { Timestamptz, UUIDv4 } from '@conduit8/core';
/**
 * Commands represent intent - "do this"
 * - Must have exactly one handler
 * - Failure should stop processing
 * - Named in imperative (RenameTranscript, DeleteFile)
 */
export abstract class BaseCommand<TName extends string = string> {
  readonly type = 'command' as const;
  abstract readonly name: TName;
}

/**
 * Events represent facts - "this happened"
 * - Can have 0 to N handlers
 * - Failure in one handler shouldn't stop others
 * - Named in past tense (TranscriptRenamed, FileDeleted)
 */
export abstract class BaseEvent<TName extends string = string> {
  readonly type = 'event' as const;
  abstract readonly name: TName;

  // Domain events are handled asynchronously by default
  readonly async: boolean = true;
  readonly id: UUIDv4 = crypto.randomUUID();
  readonly timestamp: Timestamptz = new Date().toISOString();
}

/**
 * Queries retrieve data without side effects
 * - Must have exactly one handler
 * - Should not modify state
 * - Naming convention: "Get" + Entity + Optional Qualifier
 *   Examples: GetTranscriptionById, GetUserTranscriptions, GetTranscriptionCount
 */
export abstract class BaseQuery<TResult = unknown, TName extends string = string> {
  readonly type = 'query' as const;
  abstract readonly name: TName;
  // Phantom type for result type safety
  protected readonly _resultType?: TResult;
}

/**
 * Union type for all messages
 */
export type BaseMessage = BaseCommand | BaseEvent | BaseQuery;

/**
 * Type guards for runtime checks
 */
export const isCommand = (msg: BaseMessage): msg is BaseCommand => msg.type === 'command';
export const isEvent = (msg: BaseMessage): msg is BaseEvent => msg.type === 'event';
export const isQuery = (msg: BaseMessage): msg is BaseQuery => msg.type === 'query';
