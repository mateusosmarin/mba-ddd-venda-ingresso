import { Cpf } from './cpf.vo';

test('Should create a valid CPF', () => {
  const cpf = new Cpf('616.328.030-03');
  expect(cpf).toBeDefined();
});

test('Should not create an invalid CPF', () => {
  expect(() => new Cpf('123456789')).toThrow(
    'CPF must have 11 digits, but has 9 digits',
  );
  expect(() => new Cpf('111.111.111-11')).toThrow(
    'CPF must have at least two different digits',
  );
  expect(() => new Cpf('123.456.789-00')).toThrow('CPF is invalid');
});
