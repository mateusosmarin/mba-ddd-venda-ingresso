import { Collection as MikroORMCollection } from '@mikro-orm/core';

export interface Collection<T extends object> {
  getItems(): Iterable<T>;
  add(item: T, ...items: T[]): void;
  remove(item: T, ...items: T[]): void;
  find(predicate: (item: T) => boolean): T | undefined;
  forEach(callback: (value: T, index: number) => void): void;
  map<U>(callback: (value: T, index: number) => U): U[];
  removeAll(): void;
  count(): number;
  size: number;
  values(): T[];
  [Symbol.iterator](): IterableIterator<T>;
}

export type AnyCollection<T extends object> = MikroORMCollection<T>;

export class CollectionFactory {
  static create<T extends object>(ref: object): Collection<T> {
    const collection = new MikroORMCollection<T>(ref);
    collection['initialized'] = false;
    return CollectionFactory.createProxy(collection);
  }

  static createFrom<T extends object>(
    target: MikroORMCollection<T>,
  ): Collection<T> {
    return CollectionFactory.createProxy(target);
  }

  static createProxy<T extends object>(
    target: MikroORMCollection<T>,
  ): Collection<T> {
    // @ts-expect-error - Proxy
    return new Proxy(target, {
      get(target, prop, receiver) {
        switch (prop) {
          case 'find':
            return (predicate: (item: T) => boolean): T | undefined => {
              return target.getItems(false).find(predicate);
            };
          case 'forEach':
            return (callback: (value: T, index: number) => void): void => {
              target.getItems(false).forEach(callback);
            };
          case 'count':
            return (): number => {
              return target.isInitialized()
                ? target.getItems().length
                : target.getItems(false).length;
            };
          case 'map':
            return <U>(callback: (value: T, index: number) => U): U[] => {
              return target.getItems(false).map(callback);
            };
          case 'size':
            return target.isInitialized()
              ? target.getItems().length
              : target.getItems(false).length;
          case 'values':
            return () => {
              return target.getItems(false);
            };
          default:
            return Reflect.get(target, prop, receiver);
        }
      },
    });
  }
}
