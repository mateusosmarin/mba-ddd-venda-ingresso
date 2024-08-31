import { Partner, PartnerId } from './partner.entity';

test('Should create a partner', () => {
  const partner = Partner.create({
    name: 'E-corp',
  });
  expect(partner).toBeDefined();
  expect(partner.id).toBeInstanceOf(PartnerId);
  expect(partner.name).toBe('E-corp');
});

test('Should create an event', () => {
  const partner = Partner.create({
    name: 'E-corp',
  });
  const event = partner.createEvent({
    name: 'Big Event',
    description: 'An awesome event',
    date: new Date('2024-09-01'),
  });
  expect(event.name).toBe('Big Event');
  expect(event.description).toBe('An awesome event');
  expect(event.date.toISOString()).toBe(new Date('2024-09-01').toISOString());
  expect(event.partner_id.equals(partner.id)).toBe(true);
});
