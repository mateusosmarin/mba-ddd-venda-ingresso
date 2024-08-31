import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { CustomerSchema } from '../schemas';
import { CustomerMySqlRepository } from './customer-mysql.repository';
import { Customer } from 'src/@core/events/domain/entities/customer.entity';

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

    const customer = Customer.create({
      name: 'Customer',
      cpf: '993.464.130-50',
    });
    await customerRepository.add(customer);
    await em.flush();
    em.clear();

    let customerFound = await customerRepository.findById(customer.id);
    expect(customerFound.id.equals(customer.id)).toBe(true);
    expect(customerFound.name).toBe(customer.name);
    expect(customerFound.cpf.equals(customer.cpf)).toBe(true);

    customer.changeName('Awesome Customer');
    await customerRepository.add(customer);
    await em.flush();
    em.clear();

    customerFound = await customerRepository.findById(customer.id);
    expect(customerFound.id.equals(customer.id)).toBe(true);
    expect(customerFound.name).toBe(customer.name);

    await customerRepository.delete(customer);
    await em.flush();
    em.clear();

    const customers = await customerRepository.findAll();
    expect(customers).toHaveLength(0);

    await orm.close();
  });
});
