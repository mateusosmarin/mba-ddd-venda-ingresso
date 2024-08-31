import crypto from 'crypto';
import { validate as uuidValidate } from 'uuid';
import { ValueObject } from '../value-object';

export class Uuid extends ValueObject<string> {
  constructor(id?: string) {
    super(id || crypto.randomUUID());
    this.validate();
  }

  private validate() {
    const isValid = uuidValidate(this.value);
    if (!isValid) {
      throw new InvalidUuidError(this.value);
    }
  }
}

export class InvalidUuidError extends Error {
  constructor(invalidValue: string) {
    super(`Value ${invalidValue} is not a valid UUID`);
    this.name = this.constructor.name;
  }
}
