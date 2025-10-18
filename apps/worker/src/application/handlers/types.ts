import type { BaseCommand, BaseEvent, BaseQuery } from '@worker/domain/messages/base';

// Command handlers return both result and events
export interface CommandResult<TResult> {
  result: TResult;
  events: BaseEvent[];
}

// Commands always return a result + any events they produce
export type CommandHandler<TCommand extends BaseCommand, TResult> = (
  command: TCommand,
  env: Env
) => Promise<CommandResult<TResult>>;

// Events are side effects and don't return values
export type EventHandler<TEvent extends BaseEvent> = (
  event: TEvent,
  env: Env
) => Promise<void>;

// Queries always return data
export type QueryHandler<TQuery extends BaseQuery, TResult> = (
  query: TQuery,
  env: Env
) => Promise<TResult>;
