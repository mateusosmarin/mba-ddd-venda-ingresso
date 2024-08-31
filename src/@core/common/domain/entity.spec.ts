import { Entity } from './entity';
import { Uuid } from './value-objects/uuid.vo';

class TestEntity extends Entity {
  readonly id: Uuid;

  constructor(props: { id: Uuid }) {
    super();
    this.id = props.id;
  }

  toJSON() {
    return {
      id: this.id,
    };
  }
}

test('Entities with same ids should be equal', () => {
  const id = new Uuid();
  const first = new TestEntity({ id });
  const second = new TestEntity({ id });
  expect(first.equals(second)).toBe(true);
});

test('Entities with different ids should not be equal', () => {
  const first = new TestEntity({ id: new Uuid() });
  const second = new TestEntity({ id: new Uuid() });
  expect(first.equals(second)).toBe(false);
});
