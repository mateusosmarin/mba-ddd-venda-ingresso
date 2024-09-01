import { DomainEvent } from '../domain/domain-event';

export interface DomainEventHandler {
  handle(event: DomainEvent): Promise<void>;
}
