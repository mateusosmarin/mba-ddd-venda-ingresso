import { EntityManager } from '@mikro-orm/mysql';
import { StoredEvent } from '../../../domain/entities/stored-event.entity';
import { StoredEventRepository } from '../../../domain/repositories/stored-event.repository';

export class StoredEventMySqlRepository implements StoredEventRepository {
  constructor(private entityManager: EntityManager) {}

  async add(event: StoredEvent): Promise<void> {
    this.entityManager.persist(event);
  }
}
