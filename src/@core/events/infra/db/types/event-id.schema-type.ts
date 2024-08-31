import { Type } from '@mikro-orm/core';
import { EventId } from 'src/@core/events/domain/entities/event.entity';

export class EventIdSchemaType extends Type<EventId, string> {
  convertToDatabaseValue(value: EventId | null): string {
    return value instanceof EventId ? value.value : value;
  }

  convertToJSValue(value: string): EventId {
    return new EventId(value);
  }

  getColumnType(): string {
    return 'varchar(36)';
  }
}
