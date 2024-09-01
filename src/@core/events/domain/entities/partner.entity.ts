import { AggregateRoot } from 'src/@core/common/domain/aggregate-root';
import { Uuid } from 'src/@core/common/domain/value-objects/uuid.vo';
import { Event } from './event.entity';
import { PartnerCreated } from '../domain-events/partner-created.event';

export class PartnerId extends Uuid {}

type PartnerConstructorProps = {
  id?: PartnerId | string;
  name: string;
};

type CreateEventCommand = {
  name: string;
  description?: string | null;
  date: Date;
};

export class Partner extends AggregateRoot {
  readonly id: PartnerId;
  name: string;

  constructor(props: PartnerConstructorProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new PartnerId(props.id)
        : (props.id ?? new PartnerId());
    this.name = props.name;
  }

  static create(command: { name: string }) {
    const partner = new Partner({
      name: command.name,
    });
    partner.addDomainEvent(new PartnerCreated(partner.id, partner.name));
    return partner;
  }

  createEvent(command: CreateEventCommand) {
    return Event.create({
      ...command,
      partner_id: this.id,
    });
  }

  changeName(name: string) {
    this.name = name;
    this.addDomainEvent(new PartnerCreated(this.id, this.name));
  }

  toJSON() {
    return {
      id: this.id.value,
      name: this.name,
    };
  }
}
