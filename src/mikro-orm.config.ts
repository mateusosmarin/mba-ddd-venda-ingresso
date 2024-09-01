import {
  CustomerSchema,
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  OrderSchema,
  PartnerSchema,
  SpotReservationSchema,
} from './@core/events/infra/db/schemas';

const config = {
  entities: [
    CustomerSchema,
    PartnerSchema,
    EventSchema,
    EventSectionSchema,
    EventSpotSchema,
    OrderSchema,
    SpotReservationSchema,
  ],
  dbName: 'events',
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  type: 'mysql',
};

export default config;
