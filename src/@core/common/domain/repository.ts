import { AggregateRoot } from './aggregate-root';
import { ValueObject } from './value-object';

export interface Repository<
  Entity extends AggregateRoot,
  Id extends ValueObject,
> {
  add(entity: Entity): Promise<void>;
  findById(id: Id): Promise<Entity | null>;
  findAll(): Promise<Entity[]>;
  delete(entity: Entity): Promise<void>;
}
