import { Type } from '@mikro-orm/core';
import { Cpf } from 'src/@core/common/domain/value-objects/cpf.vo';

export class CpfSchemaType extends Type<Cpf, string> {
  convertToDatabaseValue(value: Cpf | null): string {
    return value instanceof Cpf ? value.value : value;
  }

  convertToJSValue(value: string): Cpf {
    return new Cpf(value);
  }

  getColumnType(): string {
    return 'varchar(11)';
  }
}
