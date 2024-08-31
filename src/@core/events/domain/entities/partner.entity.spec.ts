import { Partner, PartnerId } from './partner.entity';

test('Should create a partner', () => {
  const partner = Partner.create({
    name: 'E-corp',
  });
  expect(partner).toBeDefined();
  expect(partner.id).toBeInstanceOf(PartnerId);
  expect(partner.name).toBe('E-corp');
});
