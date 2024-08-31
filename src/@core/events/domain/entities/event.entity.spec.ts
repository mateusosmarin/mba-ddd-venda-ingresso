import { Event, EventId } from './event.entity';
import { PartnerId } from './partner.entity';

test('Should create an event', () => {
  const partnerId = new PartnerId();
  const event = Event.create({
    name: 'Big Event',
    description: 'An awesome event',
    date: new Date('2024-09-01'),
    partner_id: partnerId,
  });
  expect(event).toBeDefined();
  expect(event.id).toBeInstanceOf(EventId);
  expect(event.name).toBe('Big Event');
  expect(event.description).toBe('An awesome event');
  expect(event.date.toISOString()).toBe(new Date('2024-09-01').toISOString());
  expect(event.partner_id.equals(partnerId)).toBeTruthy();
  expect(event.is_published).toBe(false);
  expect(event.total_spots).toBe(0);
  expect(event.total_spots_reserved).toBe(0);
});
