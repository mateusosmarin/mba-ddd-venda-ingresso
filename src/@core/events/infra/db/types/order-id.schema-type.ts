import { Type } from '@mikro-orm/core';
import { OrderId } from 'src/@core/events/domain/entities/order.entity';

export class OrderIdSchemaType extends Type<OrderId, string> {
  convertToDatabaseValue(value: OrderId | null): string {
    return value instanceof OrderId ? value.value : value;
  }

  convertToJSValue(value: string): OrderId {
    return new OrderId(value);
  }

  getColumnType(): string {
    return 'varchar(36)';
  }
}
