import EventEmitter2 from 'eventemitter2';
import { AggregateRoot, domainEventsSymbol } from './aggregate-root';
import { DomainEvent } from './domain-event';

export class DomainEventManager {
  eventEmitter: EventEmitter2;

  constructor() {
    this.eventEmitter = new EventEmitter2({
      wildcard: true,
    });
  }

  register<T extends DomainEvent>(event: string, handler: (event: T) => void) {
    this.eventEmitter.on(event, handler);
  }

  async publish<T extends AggregateRoot>(aggregateRoot: T) {
    for (const event of aggregateRoot[domainEventsSymbol]) {
      const eventClassName = event.constructor.name;
      await this.eventEmitter.emitAsync(eventClassName, event);
      aggregateRoot.clearDomainEvents();
    }
  }
}
