import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { CustomerSchema } from '../infra/db/schemas';
import { CustomerMySqlRepository } from '../infra/db/repositories/customer-mysql.repository';
import { CustomerService } from './customer.service';
import { UnitOfWorkMikroORM } from 'src/@core/common/infra/unit-of-work-mikro-orm';
import { Customer } from '../domain/entities/customer.entity';

describe('Customer repository', () => {
  test('Customer repository', async () => {
    const orm = await MikroORM.init<MySqlDriver>({
      entities: [CustomerSchema],
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
    const customerRepository = new CustomerMySqlRepository(em);
    const unitOfWork = new UnitOfWorkMikroORM(em);
    const customerService = new CustomerService(customerRepository, unitOfWork);

    const customer = await customerService.register({
      name: 'Customer',
      cpf: '993.464.130-50',
    });

    expect(customer).toBeInstanceOf(Customer);
    expect(customer.id).toBeDefined();
    expect(customer.name).toBe('Customer');
    expect(customer.cpf.value).toBe('99346413050');

    await orm.close();
  });
});
