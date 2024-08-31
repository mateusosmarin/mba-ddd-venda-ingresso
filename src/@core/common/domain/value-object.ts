import isEqual from 'lodash/isEqual';

export abstract class ValueObject<Value = unknown> {
  protected readonly _value: Value;

  constructor(value: Value) {
    this._value = deepFreeze(value);
  }

  get value(): Value {
    return this._value;
  }

  public equals(obj: this): boolean {
    if (obj === null || obj === undefined) {
      return false;
    }
    if (obj.value === undefined) {
      return false;
    }
    if (obj.constructor.name !== this.constructor.name) {
      return false;
    }
    return isEqual(this.value, obj.value);
  }

  toString() {
    if (typeof this.value !== 'object') {
      try {
        return this.value.toString();
      } catch (e) {
        return String(this.value);
      }
    }
    const valueStr = this.value.toString();
    return valueStr === '[object Object]'
      ? JSON.stringify(this.value)
      : valueStr;
  }
}

function deepFreeze<T>(obj: T) {
  const propNames = Object.getOwnPropertyNames(obj);
  for (const name of propNames) {
    const value = obj[name as keyof T];
    if (value && typeof value === 'object') {
      deepFreeze(obj);
    }
  }
  return Object.freeze(obj);
}
