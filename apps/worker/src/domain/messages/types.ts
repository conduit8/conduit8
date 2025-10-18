/**
 * Discriminated unions for all domain message types
 * Provides type-safe message handling across the application
 */

import type * as Commands from './commands';
import type * as Events from './events';
import type * as Queries from './queries';

// Auto-generate unions from all exports
type ExtractClasses<T> = T[keyof T];

// Constructor types (the classes themselves)
export type DomainCommandConstructor = ExtractClasses<typeof Commands>;
export type DomainEventConstructor = ExtractClasses<typeof Events>;
export type DomainQueryConstructor = ExtractClasses<typeof Queries>;

// Instance types (what we actually pass around)
export type DomainCommand = InstanceType<DomainCommandConstructor>;
export type DomainEvent = InstanceType<DomainEventConstructor>;
export type DomainQuery = InstanceType<DomainQueryConstructor>;
export type DomainMessage = DomainCommand | DomainEvent | DomainQuery;

export type CommandName = DomainCommand['name'];
export type EventName = DomainEvent['name'];
export type QueryName = DomainQuery['name'];
