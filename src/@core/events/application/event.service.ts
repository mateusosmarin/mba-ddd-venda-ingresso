import { UnitOfWork } from 'src/@core/common/application/unit-of-work';
import { Event, EventId } from '../domain/entities/event.entity';
import { EventRepository } from '../domain/repositories/event.repository';
import { PartnerRepository } from '../domain/repositories/partner.repository';
import { PartnerId } from '../domain/entities/partner.entity';
import { EventSectionId } from '../domain/entities/event-section.entity';
import { EventSpotId } from '../domain/entities/event-spot.entity';

export class EventService {
  constructor(
    private eventRepository: EventRepository,
    private partnerRepository: PartnerRepository,
    private uow: UnitOfWork,
  ) {}

  list() {
    return this.eventRepository.findAll();
  }

  async findSections(event_id: string) {
    const event = await this.eventRepository.findById(new EventId(event_id));
    return event.sections;
  }

  async create(input: {
    name: string;
    description?: string;
    date: Date;
    partner_id: string;
  }) {
    const partner = await this.partnerRepository.findById(
      new PartnerId(input.partner_id),
    );
    if (!partner) {
      throw new Error('Partner not found');
    }
    const event = partner.createEvent({
      name: input.name,
      date: input.date,
      description: input.description,
    });
    await this.eventRepository.add(event);
    await this.uow.commit();
    return event;
  }

  async update(
    id: string,
    input: {
      name?: string;
      description?: string;
      date?: Date;
    },
  ) {
    const event = await this.eventRepository.findById(new EventId(id));
    if (!event) {
      throw new Error('Event not found');
    }
    input.name && event.changeName(input.name);
    input.description && event.changeDescription(input.description);
    input.date && event.changeDate(input.date);
    await this.eventRepository.add(event);
    await this.uow.commit();
    return event;
  }

  async addSection(input: {
    name: string;
    description?: string | null;
    total_spots: number;
    price: number;
    event_id: string;
  }) {
    const event = await this.eventRepository.findById(
      new EventId(input.event_id),
    );
    if (!event) {
      throw new Error('Event not found');
    }
    event.addSection({
      name: input.name,
      description: input.description,
      total_spots: input.total_spots,
      price: input.price,
    });
    await this.eventRepository.add(event);
    await this.uow.commit();
    return event;
  }

  async updateSection(input: {
    name?: string;
    description?: string | null;
    event_id: string;
    section_id: string;
  }) {
    const event = await this.eventRepository.findById(
      new EventId(input.event_id),
    );
    if (!event) {
      throw new Error('Event not found');
    }
    event.changeSectionInformation({
      section_id: new EventSectionId(input.section_id),
      name: input.name,
      description: input.description,
    });
    await this.eventRepository.add(event);
    await this.uow.commit();
    return event.sections;
  }

  async findSpots(input: { event_id: string; section_id: string }) {
    const event = await this.eventRepository.findById(
      new EventId(input.event_id),
    );
    if (!event) {
      throw new Error('Event not found');
    }
    const section = event.sections.find((section) =>
      section.id.equals(new EventSectionId(input.section_id)),
    );
    if (!section) {
      throw new Error('Section not found');
    }
    return section.spots;
  }

  async updateLocation(input: {
    location: string;
    event_id: string;
    section_id: string;
    spot_id: string;
  }) {
    const event = await this.eventRepository.findById(
      new EventId(input.event_id),
    );
    if (!event) {
      throw new Error('Event not found');
    }
    event.changeSpotLocation({
      section_id: new EventSectionId(input.section_id),
      spot_id: new EventSpotId(input.spot_id),
      location: input.location,
    });
    await this.eventRepository.add(event);
    const section = event.sections.find((section) =>
      section.id.equals(new EventSectionId(input.section_id)),
    );
    await this.uow.commit();
    return section.spots.find((spot) =>
      spot.id.equals(new EventSpotId(input.spot_id)),
    );
  }

  async publishAll(input: { event_id: string }) {
    const event = await this.eventRepository.findById(
      new EventId(input.event_id),
    );
    if (!event) {
      throw new Error('Event not found');
    }
    event.publishAll();
    await this.eventRepository.add(event);
    await this.uow.commit();
    return event;
  }
}
