import { Cpf } from 'src/@core/common/domain/value-objects/cpf.vo';
import { Customer, CustomerId } from './customer.entity';

describe('Customer', () => {
  test('Should create a customer', () => {
    const customer = Customer.create({
      name: 'John Doe',
      cpf: '993.464.130-50',
    });
    expect(customer).toBeInstanceOf(Customer);
    expect(customer.id).toBeInstanceOf(CustomerId);
    expect(customer.name).toBe('John Doe');
    expect(customer.cpf).toBeInstanceOf(Cpf);
    expect(customer.cpf.value).toBe('99346413050');
  });
});
