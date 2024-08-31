import { Event, EventId } from './event.entity';
import { initOrm } from './init-orm';
import { PartnerId } from './partner.entity';

describe('Event', () => {
  initOrm();

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
    expect(event.sections.count()).toBe(0);
  });

  test('Should add a section to an event', () => {
    const partnerId = new PartnerId();
    const event = Event.create({
      name: 'Big Event',
      description: 'An awesome event',
      date: new Date('2024-09-01'),
      partner_id: partnerId,
    });
    const section = event.addSection({
      name: 'VIP',
      description: 'VIP section',
      total_spots: 100,
      price: 1000,
    });
    expect(event.sections.count()).toBe(1);
    expect(event.total_spots).toBe(100);
    expect(section.spots.count()).toBe(100);
    expect(section.total_spots).toBe(100);
  });

  test('Should publish all sections and spots of an event', () => {
    const partnerId = new PartnerId();
    const event = Event.create({
      name: 'Big Event',
      description: 'An awesome event',
      date: new Date('2024-09-01'),
      partner_id: partnerId,
    });
    event.addSection({
      name: 'Section 1',
      description: 'Section 1 description',
      total_spots: 100,
      price: 1000,
    });
    event.addSection({
      name: 'Section 2',
      description: 'Section 2 description',
      total_spots: 50,
      price: 500,
    });
    event.publishAll();
    expect(event.is_published).toBe(true);
    expect(event.sections.count()).toBe(2);
    for (const section of event.sections) {
      expect(section.is_published).toBe(true);
      for (const spot of section.spots) {
        expect(spot.is_published).toBe(true);
      }
    }
  });
});
