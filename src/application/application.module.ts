import { Module } from '@nestjs/common';
import { ApplicationService } from 'src/@core/common/application/application.service';
import { UnitOfWork } from 'src/@core/common/application/unit-of-work';
import { DomainEventManager } from 'src/@core/common/domain/domain-event-manager';

@Module({
  providers: [
    {
      provide: ApplicationService,
      inject: ['UnitOfWork', DomainEventManager],
      useFactory(uow: UnitOfWork, domainEventManager: DomainEventManager) {
        return new ApplicationService(uow, domainEventManager);
      },
    },
  ],
  exports: [ApplicationService],
})
export class ApplicationModule {}
