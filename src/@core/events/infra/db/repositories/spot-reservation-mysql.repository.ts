import { EntityManager } from '@mikro-orm/mysql';
import { EventSpotId } from 'src/@core/events/domain/entities/event-spot.entity';
import {
  SpotReservation,
  SpotReservationId,
} from 'src/@core/events/domain/entities/spot-reservation.entity';
import { SpotReservationRepository } from 'src/@core/events/domain/repositories/spot-reservation.repository';

export class SpotReservationMySqlRepository
  implements SpotReservationRepository
{
  constructor(private entityManager: EntityManager) {}

  async add(entity: SpotReservation): Promise<void> {
    this.entityManager.persist(entity);
  }

  async findById(id: SpotReservationId): Promise<SpotReservation | null> {
    return this.entityManager.findOne(SpotReservation, {
      id: id instanceof SpotReservationId ? id : new SpotReservationId(id),
    });
  }

  async findBySpotId(spotId: EventSpotId): Promise<SpotReservation | null> {
    return this.entityManager.findOne(SpotReservation, {
      spot_id: spotId instanceof EventSpotId ? spotId : new EventSpotId(spotId),
    });
  }

  async findAll(): Promise<SpotReservation[]> {
    return this.entityManager.find(SpotReservation, {});
  }

  async delete(entity: SpotReservation): Promise<void> {
    this.entityManager.remove(entity);
  }
}
