import { DomainEvent } from './domain-event';
import { Entity } from './entity';

export const domainEventsSymbol = Symbol.for('domainEvents');

export abstract class AggregateRoot extends Entity {
  [domainEventsSymbol]: Set<DomainEvent>;

  constructor() {
    super();
    this[domainEventsSymbol] = new Set<DomainEvent>();
  }

  addDomainEvent(event: DomainEvent) {
    this[domainEventsSymbol].add(event);
  }

  clearDomainEvents() {
    this[domainEventsSymbol].clear();
  }
}
