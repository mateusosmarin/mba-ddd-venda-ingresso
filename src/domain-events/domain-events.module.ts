import { Global, Module, OnModuleInit } from '@nestjs/common';
import { DomainEventManager } from 'src/@core/common/domain/domain-event-manager';
import { IntegrationEventsPublisher } from './integration-events.publisher';
import { ModuleRef } from '@nestjs/core';
import { StoredEventRepository } from 'src/@core/stored-events/domain/repositories/stored-event.repository';
import { StoredEvent } from 'src/@core/stored-events/domain/entities/stored-event.entity';
import { EntityManager } from '@mikro-orm/mysql';
import { StoredEventMySqlRepository } from 'src/@core/stored-events/infra/db/repositories/stored-event-mysql.repository';

@Global()
@Module({
  providers: [
    DomainEventManager,
    IntegrationEventsPublisher,
    {
      provide: 'StoredEventRepository',
      inject: [EntityManager],
      useFactory(em: EntityManager) {
        return new StoredEventMySqlRepository(em);
      },
    },
  ],
  exports: [DomainEventManager],
})
export class DomainEventsModule implements OnModuleInit {
  constructor(
    private readonly domainEventManager: DomainEventManager,
    private moduleRef: ModuleRef,
  ) {}

  onModuleInit() {
    this.domainEventManager.register('*', async (event) => {
      const repository: StoredEventRepository = await this.moduleRef.resolve(
        'StoredEventRepository',
      );
      await repository.add(StoredEvent.create(event));
    });
  }
}
