import { DomainEventHandler } from 'src/@core/common/application/domain-event.handler';
import { PartnerCreated } from '../../domain/domain-events/partner-created.event';
import { DomainEvent } from 'src/@core/common/domain/domain-event';

export class LogHandler implements DomainEventHandler {
  async handle(event: DomainEvent) {
    console.log(event);
  }

  static listensTo() {
    return [PartnerCreated.name];
  }
}
