import { EntityManager } from '@mikro-orm/mysql';
import { Event, EventId } from 'src/@core/events/domain/entities/event.entity';
import { EventRepository } from 'src/@core/events/domain/repositories/event.repository';

export class EventMySqlRepository implements EventRepository {
  constructor(private entityManager: EntityManager) {}

  async add(entity: Event): Promise<void> {
    this.entityManager.persist(entity);
  }

  async findById(id: EventId): Promise<Event | null> {
    return this.entityManager.findOne(Event, {
      id: id instanceof EventId ? id : new EventId(id),
    });
  }

  async findAll(): Promise<Event[]> {
    return this.entityManager.find(Event, {});
  }

  async delete(entity: Event): Promise<void> {
    this.entityManager.remove(entity);
  }
}
