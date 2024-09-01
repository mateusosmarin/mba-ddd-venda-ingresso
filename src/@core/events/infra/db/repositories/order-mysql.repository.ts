import { EntityManager } from '@mikro-orm/mysql';
import { Order, OrderId } from 'src/@core/events/domain/entities/order.entity';
import { OrderRepository } from 'src/@core/events/domain/repositories/order.repository';

export class OrderMySqlRepository implements OrderRepository {
  constructor(private entityManager: EntityManager) {}

  async add(entity: Order): Promise<void> {
    this.entityManager.persist(entity);
  }

  async findById(id: OrderId): Promise<Order | null> {
    return this.entityManager.findOne(Order, {
      id: id instanceof OrderId ? id : new OrderId(id),
    });
  }

  async findAll(): Promise<Order[]> {
    return this.entityManager.find(Order, {});
  }

  async delete(entity: Order): Promise<void> {
    this.entityManager.remove(entity);
  }
}
