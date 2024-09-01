import { AggregateRoot } from 'src/@core/common/domain/aggregate-root';
import { DomainEvent } from 'src/@core/common/domain/domain-event';
import { Uuid } from 'src/@core/common/domain/value-objects/uuid.vo';

export class StoredEventId extends Uuid {}

type StoredEventConstructorProps = {
  id?: StoredEventId | string;
  type_name: string;
  occurred_on: Date;
  body: unknown;
};

export class StoredEvent extends AggregateRoot {
  id: StoredEventId;
  type_name: string;
  occurred_on: Date;
  body: unknown;

  constructor(props: StoredEventConstructorProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new StoredEventId(props.id)
        : (props.id ?? new StoredEventId());
    this.type_name = props.type_name;
    this.occurred_on = props.occurred_on;
    this.body = props.body;
  }

  static create(domainEvent: DomainEvent) {
    return new StoredEvent({
      type_name: domainEvent.constructor.name,
      occurred_on: domainEvent.occurred_on,
      body: domainEvent,
    });
  }

  toJSON() {
    return {
      id: this.id.value,
      type_name: this.type_name,
      occurred_on: this.occurred_on.toISOString(),
      body: this.body,
    };
  }
}
