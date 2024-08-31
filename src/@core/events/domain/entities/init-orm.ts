import { MikroORM } from '@mikro-orm/core';
import {
  CustomerSchema,
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  PartnerSchema,
} from '../../infra/db/schemas';

export function initOrm() {
  beforeAll(async () => {
    await MikroORM.init(
      {
        allowGlobalContext: true,
        entities: [
          PartnerSchema,
          CustomerSchema,
          EventSchema,
          EventSectionSchema,
          EventSpotSchema,
        ],
        type: 'mysql',
        dbName: 'fake',
      },
      false,
    );
  });
}
