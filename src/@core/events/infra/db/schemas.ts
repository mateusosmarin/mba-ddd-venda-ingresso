import { Cascade, EntitySchema } from '@mikro-orm/core';
import { Partner } from '../../domain/entities/partner.entity';
import { PartnerIdSchemaType } from './types/partner-id.schema-type';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerIdSchemaType } from './types/customer-id.schema-type';
import { CpfSchemaType } from './types/cpf.schema-type';
import { EventIdSchemaType } from './types/event-id.schema-type';
import { EventSection } from '../../domain/entities/event-section.entity';
import { EventSectionIdSchemaType } from './types/event-section-id.schema-type';
import { EventSpot } from '../../domain/entities/event-spot.entity';
import { EventSpotIdSchemaType } from './types/event-spot-id.schema-type';
import { Event } from '../../domain/entities/event.entity';
import { Order, OrderStatus } from '../../domain/entities/order.entity';
import { SpotReservation } from '../../domain/entities/spot-reservation.entity';
import { SpotReservationIdSchemaType } from './types/spot-reservation-id.schema-type';
import { OrderIdSchemaType } from './types/order-id.schema-type';

export const PartnerSchema = new EntitySchema<Partner>({
  class: Partner,
  properties: {
    id: { primary: true, customType: new PartnerIdSchemaType() },
    name: { type: 'string', length: 255 },
  },
});

export const CustomerSchema = new EntitySchema<Customer>({
  class: Customer,
  uniques: [{ properties: ['cpf'] }],
  properties: {
    id: { primary: true, customType: new CustomerIdSchemaType() },
    cpf: { customType: new CpfSchemaType() },
    name: { type: 'string', length: 255 },
  },
});

export const EventSchema = new EntitySchema<Event>({
  class: Event,
  properties: {
    id: { primary: true, customType: new EventIdSchemaType() },
    name: { type: 'string', length: 255 },
    description: { type: 'string', nullable: true },
    date: { type: 'date' },
    is_published: { type: 'boolean', default: false },
    total_spots: { type: 'number', default: 0 },
    total_spots_reserved: { type: 'number', default: 0 },
    sections: {
      reference: '1:m',
      entity: () => EventSection,
      mappedBy: (section) => section.event_id,
      eager: true,
      cascade: [Cascade.ALL],
    },
    partner_id: {
      reference: 'm:1',
      entity: () => Partner,
      hidden: true,
      mapToPk: true,
      customType: new PartnerIdSchemaType(),
      inherited: true,
    },
  },
});

export const EventSectionSchema = new EntitySchema<EventSection>({
  class: EventSection,
  properties: {
    id: { primary: true, customType: new EventSectionIdSchemaType() },
    name: { type: 'string', length: 255 },
    description: { type: 'string', nullable: true },
    is_published: { type: 'boolean', default: false },
    total_spots: { type: 'number', default: 0 },
    total_spots_reserved: { type: 'number', default: 0 },
    price: { type: 'number', default: 0 },
    spots: {
      reference: '1:m',
      entity: () => EventSpot,
      mappedBy: (spot) => spot.event_section_id,
      eager: true,
      cascade: [Cascade.ALL],
    },
    event_id: {
      reference: 'm:1',
      entity: () => Event,
      hidden: true,
      mapToPk: true,
      customType: new EventIdSchemaType(),
    },
  },
});

export const EventSpotSchema = new EntitySchema<EventSpot>({
  class: EventSpot,
  properties: {
    id: { primary: true, customType: new EventSpotIdSchemaType() },
    location: { type: 'string', length: 255, nullable: true },
    is_published: { type: 'boolean', default: false },
    is_reserved: { type: 'boolean', default: false },
    event_section_id: {
      reference: 'm:1',
      entity: () => EventSection,
      hidden: true,
      mapToPk: true,
      customType: new EventSectionIdSchemaType(),
    },
  },
});

export const OrderSchema = new EntitySchema<Order>({
  class: Order,
  properties: {
    id: {
      customType: new OrderIdSchemaType(),
      primary: true,
    },
    amount: { type: 'number' },
    status: { enum: true, items: () => OrderStatus },
    customer_id: {
      customType: new CustomerIdSchemaType(),
      primary: true,
      reference: 'm:1',
      entity: () => Customer,
      mapToPk: true,
      hidden: true,
      inherited: true,
    },
    event_spot_id: {
      customType: new EventSpotIdSchemaType(),
      primary: true,
      reference: 'm:1',
      entity: () => EventSpot,
      mapToPk: true,
      hidden: true,
      inherited: true,
    },
  },
});

export const SpotReservationSchema = new EntitySchema<SpotReservation>({
  class: SpotReservation,
  uniques: [{ properties: ['spot_id'] }],
  properties: {
    id: {
      customType: new SpotReservationIdSchemaType(),
      primary: true,
    },
    spot_id: {
      customType: new EventSpotIdSchemaType(),
      primary: true,
      reference: 'm:1',
      entity: () => EventSpot,
      mapToPk: true,
    },
    reservation_date: { type: 'date' },
    customer_id: {
      customType: new CustomerIdSchemaType(),
      primary: true,
      reference: 'm:1',
      entity: () => Customer,
      mapToPk: true,
      hidden: true,
      inherited: true,
    },
  },
});
