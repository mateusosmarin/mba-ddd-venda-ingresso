import { EventSection, EventSectionId } from './event-section.entity';

describe('Event section', () => {
  test('Should create an event section', () => {
    const eventSection = EventSection.create({
      name: 'VIP',
      description: 'VIP section',
      total_spots: 0,
      price: 100,
    });
    expect(eventSection).toBeDefined();
    expect(eventSection.id).toBeInstanceOf(EventSectionId);
    expect(eventSection.name).toBe('VIP');
    expect(eventSection.description).toBe('VIP section');
    expect(eventSection.total_spots).toBe(0);
    expect(eventSection.total_spots_reserved).toBe(0);
    expect(eventSection.price).toBe(100);
    expect(eventSection.is_published).toBe(false);
    expect(eventSection.spots.count()).toBe(0);
  });
});
