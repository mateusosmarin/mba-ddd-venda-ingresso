import { DomainEvent } from 'src/@core/common/domain/domain-event';
import { PartnerId } from '../entities/partner.entity';

export class PartnerCreated implements DomainEvent {
  readonly event_version = 1;
  readonly occurred_on: Date;

  constructor(
    readonly aggregate_id: PartnerId,
    readonly name: string,
  ) {
    this.occurred_on = new Date();
  }
}
