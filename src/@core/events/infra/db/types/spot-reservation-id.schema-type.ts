import { Type } from '@mikro-orm/core';
import { SpotReservationId } from 'src/@core/events/domain/entities/spot-reservation.entity';

export class SpotReservationIdSchemaType extends Type<
  SpotReservationId,
  string
> {
  convertToDatabaseValue(value: SpotReservationId | null): string {
    return value instanceof SpotReservationId ? value.value : value;
  }

  convertToJSValue(value: string): SpotReservationId {
    return new SpotReservationId(value);
  }

  getColumnType(): string {
    return 'varchar(36)';
  }
}
