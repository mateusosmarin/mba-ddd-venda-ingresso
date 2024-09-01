import { StoredEvent } from '../entities/stored-event.entity';

export interface StoredEventRepository {
  add(event: StoredEvent): Promise<void>;
}
