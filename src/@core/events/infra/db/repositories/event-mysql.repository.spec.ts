import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import {
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  PartnerSchema,
} from '../schemas';
import { EventMySqlRepository } from './event-mysql.repository';
import { Partner } from 'src/@core/events/domain/entities/partner.entity';
import { PartnerMySqlRepository } from './partner-mysql.repository';

describe('Event repository', () => {
  test('Event repository', async () => {
    const orm = await MikroORM.init<MySqlDriver>({
      entities: [
        PartnerSchema,
        EventSchema,
        EventSectionSchema,
        EventSpotSchema,
      ],
      dbName: 'events',
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'root',
      type: 'mysql',
      forceEntityConstructor: true,
    });

    await orm.schema.refreshDatabase();
    const em = orm.em.fork();
    const partnerRepository = new PartnerMySqlRepository(em);
    const eventRepository = new EventMySqlRepository(em);

    const partner = Partner.create({ name: 'Partner' });
    await partnerRepository.add(partner);

    const event = partner.createEvent({
      name: 'Event',
      date: new Date('2024-09-01'),
    });
    await eventRepository.add(event);

    await em.flush();
    em.clear();

    await orm.close();
  });
});
