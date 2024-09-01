import { IntegrationEvent } from 'src/@core/common/domain/integration-event';
import { PartnerCreated } from '../domain-events/partner-created.event';

type Payload = {
  id: string;
  name: string;
};

export class PartnerCreatedIntegrationEvent
  implements IntegrationEvent<Payload>
{
  event_name: string;
  event_version: number;
  occurred_on: Date;
  payload: Payload;

  constructor(domainEvent: PartnerCreated) {
    this.event_name = PartnerCreatedIntegrationEvent.name;
    this.event_version = 1;
    this.occurred_on = domainEvent.occurred_on;
    this.payload = {
      id: domainEvent.aggregate_id.value,
      name: domainEvent.name,
    };
  }
}
