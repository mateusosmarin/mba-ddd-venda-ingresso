import { ValueObject } from './value-object';

export abstract class Entity {
  abstract readonly id: ValueObject<unknown>;

  abstract toJSON(): unknown;

  equals(obj: this): boolean {
    if (obj === null || obj === undefined) {
      return false;
    }
    if (obj.id === null || obj.id === undefined) {
      return false;
    }
    if (obj.constructor.name !== this.constructor.name) {
      return false;
    }
    return obj.id.equals(this.id);
  }
}
