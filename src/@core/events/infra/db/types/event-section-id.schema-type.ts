import { Type } from '@mikro-orm/core';
import { EventSectionId } from 'src/@core/events/domain/entities/event-section.entity';

export class EventSectionIdSchemaType extends Type<EventSectionId, string> {
  convertToDatabaseValue(value: EventSectionId | null): string {
    return value instanceof EventSectionId ? value.value : value;
  }

  convertToJSValue(value: string): EventSectionId {
    return new EventSectionId(value);
  }

  getColumnType(): string {
    return 'varchar(36)';
  }
}
