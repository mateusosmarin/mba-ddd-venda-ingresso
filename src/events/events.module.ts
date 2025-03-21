import { EntityManager } from '@mikro-orm/mysql';
import { Queue } from 'bull';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, OnModuleInit } from '@nestjs/common';
import { UnitOfWork } from 'src/@core/common/application/unit-of-work';
import { CustomerService } from 'src/@core/events/application/customer.service';
import { EventService } from 'src/@core/events/application/event.service';
import { OrderService } from 'src/@core/events/application/order.service';
import { PartnerService } from 'src/@core/events/application/partner.service';
import { PaymentGateway } from 'src/@core/events/application/payment.gateway';
import { CustomerRepository } from 'src/@core/events/domain/repositories/customer.repository';
import { EventRepository } from 'src/@core/events/domain/repositories/event.repository';
import { OrderRepository } from 'src/@core/events/domain/repositories/order.repository';
import { PartnerRepository } from 'src/@core/events/domain/repositories/partner.repository';
import { SpotReservationRepository } from 'src/@core/events/domain/repositories/spot-reservation.repository';
import { CustomerMySqlRepository } from 'src/@core/events/infra/db/repositories/customer-mysql.repository';
import { EventMySqlRepository } from 'src/@core/events/infra/db/repositories/event-mysql.repository';
import { OrderMySqlRepository } from 'src/@core/events/infra/db/repositories/order-mysql.repository';
import { PartnerMySqlRepository } from 'src/@core/events/infra/db/repositories/partner-mysql.repository';
import { SpotReservationMySqlRepository } from 'src/@core/events/infra/db/repositories/spot-reservation-mysql.repository';
import {
  CustomerSchema,
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  OrderSchema,
  PartnerSchema,
  SpotReservationSchema,
} from 'src/@core/events/infra/db/schemas';
import { PartnersController } from './partners/partners.controller';
import { CustomersController } from './customers/customers.controller';
import { EventsController } from './events/events.controller';
import { EventSectionsController } from './event-sections/event-sections.controller';
import { EventSpotsController } from './event-spots/event-spots.controller';
import { OrdersController } from './orders/orders.controller';
import { ApplicationModule } from 'src/application/application.module';
import { ApplicationService } from 'src/@core/common/application/application.service';
import { DomainEventManager } from 'src/@core/common/domain/domain-event-manager';
import { ModuleRef } from '@nestjs/core';
import { LogHandler } from 'src/@core/events/application/handlers/log.handler';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { IntegrationEvent } from 'src/@core/common/domain/integration-event';
import { PartnerCreated } from 'src/@core/events/domain/domain-events/partner-created.event';
import { PartnerCreatedIntegrationEvent } from 'src/@core/events/domain/integration-events/partner-created.integration-event';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      CustomerSchema,
      PartnerSchema,
      EventSchema,
      EventSectionSchema,
      EventSpotSchema,
      OrderSchema,
      SpotReservationSchema,
    ]),
    ApplicationModule,
    BullModule.registerQueue({
      name: 'integration-events',
    }),
  ],
  providers: [
    {
      provide: 'CustomerRepository',
      inject: [EntityManager],
      useFactory(em: EntityManager) {
        return new CustomerMySqlRepository(em);
      },
    },
    {
      provide: 'PartnerRepository',
      inject: [EntityManager],
      useFactory(em: EntityManager) {
        return new PartnerMySqlRepository(em);
      },
    },
    {
      provide: 'EventRepository',
      inject: [EntityManager],
      useFactory(em: EntityManager) {
        return new EventMySqlRepository(em);
      },
    },
    {
      provide: 'OrderRepository',
      inject: [EntityManager],
      useFactory(em: EntityManager) {
        return new OrderMySqlRepository(em);
      },
    },
    {
      provide: 'SpotReservationRepository',
      inject: [EntityManager],
      useFactory(em: EntityManager) {
        return new SpotReservationMySqlRepository(em);
      },
    },
    {
      provide: CustomerService,
      inject: ['CustomerRepository', 'UnitOfWork'],
      useFactory(
        customerRepository: CustomerRepository,
        unitOfWork: UnitOfWork,
      ) {
        return new CustomerService(customerRepository, unitOfWork);
      },
    },
    {
      provide: PartnerService,
      inject: ['PartnerRepository', ApplicationService],
      useFactory(
        partnerRepository: PartnerRepository,
        applicationService: ApplicationService,
      ) {
        return new PartnerService(partnerRepository, applicationService);
      },
    },
    {
      provide: EventService,
      inject: ['EventRepository', 'PartnerRepository', 'UnitOfWork'],
      useFactory(
        eventRepository: EventRepository,
        partnerRepository: PartnerRepository,
        unitOfWork: UnitOfWork,
      ) {
        return new EventService(eventRepository, partnerRepository, unitOfWork);
      },
    },
    PaymentGateway,
    {
      provide: OrderService,
      inject: [
        'OrderRepository',
        'CustomerRepository',
        'EventRepository',
        'SpotReservationRepository',
        PaymentGateway,
        'UnitOfWork',
      ],
      useFactory(
        orderRepository: OrderRepository,
        customerRepository: CustomerRepository,
        eventRepository: EventRepository,
        spotReservationRepository: SpotReservationRepository,
        paymentGateway: PaymentGateway,
        unitOfWork: UnitOfWork,
      ) {
        return new OrderService(
          orderRepository,
          customerRepository,
          eventRepository,
          spotReservationRepository,
          paymentGateway,
          unitOfWork,
        );
      },
    },
    LogHandler,
  ],
  controllers: [
    PartnersController,
    CustomersController,
    EventsController,
    EventSectionsController,
    EventSpotsController,
    OrdersController,
  ],
})
export class EventsModule implements OnModuleInit {
  constructor(
    private readonly domainEventManager: DomainEventManager,
    private moduleRef: ModuleRef,
    @InjectQueue('integration-events')
    private integrationEventsQueue: Queue<IntegrationEvent<unknown>>,
  ) {}

  onModuleInit() {
    LogHandler.listensTo().forEach((eventName) => {
      this.domainEventManager.register(eventName, async (event) => {
        const handler = await this.moduleRef.resolve(LogHandler);
        await handler.handle(event);
      });
    });
    this.domainEventManager.register(
      PartnerCreated.name,
      async (event: PartnerCreated) => {
        const integrationEvent = new PartnerCreatedIntegrationEvent(event);
        await this.integrationEventsQueue.add(integrationEvent);
      },
    );
  }
}
