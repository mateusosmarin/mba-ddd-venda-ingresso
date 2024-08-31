import { Type } from '@mikro-orm/core';
import { EventSpotId } from 'src/@core/events/domain/entities/event-spot.entity';

export class EventSpotIdSchemaType extends Type<EventSpotId, string> {
  convertToDatabaseValue(value: EventSpotId | null): string {
    return value instanceof EventSpotId ? value.value : value;
  }

  convertToJSValue(value: string): EventSpotId {
    return new EventSpotId(value);
  }

  getColumnType(): string {
    return 'varchar(36)';
  }
}
