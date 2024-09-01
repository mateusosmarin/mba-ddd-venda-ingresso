import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { IntegrationEvent } from 'src/@core/common/domain/integration-event';

@Processor('integration-events')
export class IntegrationEventsPublisher {
  constructor(private amqpConnection: AmqpConnection) {}

  @Process()
  async handle(job: Job<IntegrationEvent<unknown>>) {
    await this.amqpConnection.publish(
      'amq.direct',
      job.data.event_name,
      job.data,
    );
  }
}
