import { ValueObject } from './value-object';

export interface DomainEvent {
  aggregate_id: ValueObject<unknown>;
  occurred_on: Date;
  event_version: number;
}
