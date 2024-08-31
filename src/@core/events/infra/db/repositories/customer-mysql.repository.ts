import { EntityManager } from '@mikro-orm/mysql';
import {
  Customer,
  CustomerId,
} from 'src/@core/events/domain/entities/customer.entity';
import { CustomerRepository } from 'src/@core/events/domain/repositories/customer.repository';

export class CustomerMySqlRepository implements CustomerRepository {
  constructor(private entityManager: EntityManager) {}

  async add(entity: Customer): Promise<void> {
    this.entityManager.persist(entity);
  }

  async findById(id: CustomerId): Promise<Customer | null> {
    return this.entityManager.findOne(Customer, {
      id: id instanceof CustomerId ? id : new CustomerId(id),
    });
  }

  async findAll(): Promise<Customer[]> {
    return this.entityManager.find(Customer, {});
  }

  async delete(entity: Customer): Promise<void> {
    this.entityManager.remove(entity);
  }
}
