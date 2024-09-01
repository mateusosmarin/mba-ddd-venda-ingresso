import { EntityManager } from '@mikro-orm/mysql';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Global, Module } from '@nestjs/common';
import { UnitOfWorkMikroORM } from 'src/@core/common/infra/unit-of-work-mikro-orm';
import {
  CustomerSchema,
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  OrderSchema,
  PartnerSchema,
  SpotReservationSchema,
} from 'src/@core/events/infra/db/schemas';
import { StoredEventSchema } from 'src/@core/stored-events/infra/db/schemas';

@Global()
@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: [
        CustomerSchema,
        PartnerSchema,
        EventSchema,
        EventSectionSchema,
        EventSpotSchema,
        OrderSchema,
        SpotReservationSchema,
        StoredEventSchema,
      ],
      dbName: 'events',
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'root',
      type: 'mysql',
      forceEntityConstructor: true,
    }),
  ],
  providers: [
    {
      provide: 'UnitOfWork',
      inject: [EntityManager],
      useFactory(em: EntityManager) {
        return new UnitOfWorkMikroORM(em);
      },
    },
  ],
  exports: ['UnitOfWork'],
})
export class DatabaseModule {}
