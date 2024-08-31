import { Uuid } from './uuid.vo';

test('Should create a UUID', () => {
  const uuid = new Uuid();
  expect(uuid).toBeDefined();
});

test('Should create a valid UUID', () => {
  const uuid = new Uuid('cff90150-7b54-40ad-8ccb-148a9be66cee');
  expect(uuid).toBeDefined();
});

test('Should not create an invalid UUID', () => {
  expect(() => new Uuid('1234567890')).toThrow(
    'Value 1234567890 is not a valid UUID',
  );
});
