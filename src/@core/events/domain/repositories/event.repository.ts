import { Repository } from 'src/@core/common/domain/repository';
import { Event, EventId } from '../entities/event.entity';

export interface EventRepository extends Repository<Event, EventId> {}
