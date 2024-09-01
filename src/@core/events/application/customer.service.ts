import { UnitOfWork } from 'src/@core/common/application/unit-of-work';
import { Customer, CustomerId } from '../domain/entities/customer.entity';
import { CustomerRepository } from '../domain/repositories/customer.repository';

export class CustomerService {
  constructor(
    private customerRepository: CustomerRepository,
    private uow: UnitOfWork,
  ) {}

  list() {
    return this.customerRepository.findAll();
  }

  async register(input: { name: string; cpf: string }) {
    const customer = Customer.create(input);
    await this.customerRepository.add(customer);
    await this.uow.commit();
    return customer;
  }

  async update(id: string, input: { name?: string }) {
    const customer = await this.customerRepository.findById(new CustomerId(id));
    if (!customer) {
      throw new Error('Customer not found');
    }
    input.name && customer.changeName(input.name);
    await this.customerRepository.add(customer);
    await this.uow.commit();
    return customer;
  }
}
