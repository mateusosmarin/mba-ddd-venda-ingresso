import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { PartnerSchema } from '../schemas';
import { PartnerMySqlRepository } from './partner-mysql.repository';
import { Partner } from 'src/@core/events/domain/entities/partner.entity';

describe('Partner repository', () => {
  test('Partner repository', async () => {
    const orm = await MikroORM.init<MySqlDriver>({
      entities: [PartnerSchema],
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

    const partner = Partner.create({
      name: 'Partner',
    });
    await partnerRepository.add(partner);
    await em.flush();
    em.clear();

    let partnerFound = await partnerRepository.findById(partner.id);
    expect(partnerFound.id.equals(partner.id)).toBe(true);
    expect(partnerFound.name).toBe(partner.name);

    partner.changeName('Awesome Partner');
    await partnerRepository.add(partner);
    await em.flush();
    em.clear();

    partnerFound = await partnerRepository.findById(partner.id);
    expect(partnerFound.id.equals(partner.id)).toBe(true);
    expect(partnerFound.name).toBe(partner.name);

    await partnerRepository.delete(partner);
    await em.flush();
    em.clear();

    const partners = await partnerRepository.findAll();
    expect(partners).toHaveLength(0);

    await orm.close();
  });
});
