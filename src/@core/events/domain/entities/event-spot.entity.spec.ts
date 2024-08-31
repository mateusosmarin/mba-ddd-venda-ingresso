import { EventSpot, EventSpotId } from './event-spot.entity';

describe('Event spot', () => {
  test('Should create an event spot', () => {
    const eventSpot = EventSpot.create();
    expect(eventSpot).toBeDefined();
    expect(eventSpot.id).toBeInstanceOf(EventSpotId);
    expect(eventSpot.location).toBeNull();
    expect(eventSpot.is_reserved).toBe(false);
    expect(eventSpot.is_published).toBe(false);
  });
});
