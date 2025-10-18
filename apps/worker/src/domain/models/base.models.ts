import type { BaseEvent } from '@worker/domain/messages';

/**
 * Base class for entities - objects with identity that live within an aggregate
 * Entities have identity but do NOT emit events (only roots do)
 * Child entities are always accessed through their aggregate root
 */
export abstract class Entity {
  abstract readonly id: string;
}

/**
 * Base class for aggregate roots - transactional consistency boundaries
 * - Owns all child entities and value objects within the aggregate
 * - ONLY aggregate roots have repositories (never child entities)
 * - ONLY aggregate roots emit domain events (capturing changes to any part of the aggregate)
 * - Ensures invariants across the entire aggregate
 */
export abstract class AggregateRoot extends Entity {
  private _events: BaseEvent[] = [];

  protected addEvent(event: BaseEvent): void {
    this._events.push(event);
  }

  collectEvents(): BaseEvent[] {
    return [...this._events];
  }

  clearEvents(): void {
    this._events = [];
  }
}

/**
 * Base class for value objects - immutable objects compared by value
 */
export abstract class ValueObject<T = any> {
  /**
   * Check equality by value, not reference
   */
  abstract equals(other: T): boolean;

  abstract toPlainObject(): Record<string, any>;
}
