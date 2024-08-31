import { Type } from '@mikro-orm/core';
import { CustomerId } from 'src/@core/events/domain/entities/customer.entity';

export class CustomerIdSchemaType extends Type<CustomerId, string> {
  convertToDatabaseValue(value: CustomerId | null): string {
    return value instanceof CustomerId ? value.value : value;
  }

  convertToJSValue(value: string): CustomerId {
    return new CustomerId(value);
  }

  getColumnType(): string {
    return 'varchar(36)';
  }
}
