import { Type } from '@mikro-orm/core';
import { PartnerId } from 'src/@core/events/domain/entities/partner.entity';

export class PartnerIdSchemaType extends Type<PartnerId, string> {
  convertToDatabaseValue(value: PartnerId | null): string {
    return value instanceof PartnerId ? value.value : value;
  }

  convertToJSValue(value: string): PartnerId {
    return new PartnerId(value);
  }

  getColumnType(): string {
    return 'varchar(36)';
  }
}
