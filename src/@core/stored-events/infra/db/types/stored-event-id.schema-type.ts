import { Type } from '@mikro-orm/core';
import { StoredEventId } from 'src/@core/stored-events/domain/entities/stored-event.entity';

export class StoredEventIdSchemaType extends Type<StoredEventId, string> {
  convertToDatabaseValue(value: StoredEventId | null): string {
    return value instanceof StoredEventId ? value.value : value;
  }

  convertToJSValue(value: string): StoredEventId {
    return new StoredEventId(value);
  }

  getColumnType(): string {
    return 'varchar(36)';
  }
}
