import { Repository } from 'src/@core/common/domain/repository';
import {
  SpotReservation,
  SpotReservationId,
} from '../entities/spot-reservation.entity';
import { EventSpotId } from '../entities/event-spot.entity';

export interface SpotReservationRepository
  extends Repository<SpotReservation, SpotReservationId> {
  findBySpotId(spotId: EventSpotId): Promise<SpotReservation>;
}
