import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import {
  CustomerSchema,
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  OrderSchema,
  PartnerSchema,
  SpotReservationSchema,
} from '../infra/db/schemas';
import { OrderMySqlRepository } from '../infra/db/repositories/order-mysql.repository';
import { OrderService } from './order.service';
import { UnitOfWorkMikroORM } from 'src/@core/common/infra/unit-of-work-mikro-orm';
import { CustomerMySqlRepository } from '../infra/db/repositories/customer-mysql.repository';
import { PartnerMySqlRepository } from '../infra/db/repositories/partner-mysql.repository';
import { EventMySqlRepository } from '../infra/db/repositories/event-mysql.repository';
import { SpotReservationMySqlRepository } from '../infra/db/repositories/spot-reservation-mysql.repository';
import { Customer } from '../domain/entities/customer.entity';
import { Partner } from '../domain/entities/partner.entity';
import { OrderStatus } from '../domain/entities/order.entity';
import { PaymentGateway } from './payment.gateway';

describe('Order repository', () => {
  test('Order repository', async () => {
    const orm = await MikroORM.init<MySqlDriver>({
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
      forceEntityConstructor: true,
    });

    await orm.schema.refreshDatabase();
    const em = orm.em.fork();

    const unitOfWork = new UnitOfWorkMikroORM(em);

    const orderRepository = new OrderMySqlRepository(em);
    const customerRepository = new CustomerMySqlRepository(em);
    const eventRepository = new EventMySqlRepository(em);
    const partnerRepository = new PartnerMySqlRepository(em);

    const customer = Customer.create({
      name: 'Customer',
      cpf: '993.464.130-50',
    });
    await customerRepository.add(customer);

    const partner = Partner.create({
      name: 'Partner',
    });
    await partnerRepository.add(partner);

    const event = partner.createEvent({
      name: 'Event',
      date: new Date(),
    });
    const section = event.addSection({
      name: 'Section 1',
      price: 100,
      total_spots: 100,
    });
    event.publishAll();
    await eventRepository.add(event);

    await unitOfWork.commit();
    em.clear();

    const spotReservationRepository = new SpotReservationMySqlRepository(em);
    const paymentGateway = new PaymentGateway();
    const orderService = new OrderService(
      orderRepository,
      customerRepository,
      eventRepository,
      spotReservationRepository,
      paymentGateway,
      unitOfWork,
    );

    const spot = section.spots.find(() => true);

    await expect(
      Promise.all([
        orderService.create({
          event_id: event.id.value,
          section_id: section.id.value,
          spot_id: spot.id.value,
          customer_id: customer.id.value,
        }),
        orderService.create({
          event_id: event.id.value,
          section_id: section.id.value,
          spot_id: spot.id.value,
          customer_id: customer.id.value,
        }),
      ]),
    ).rejects.toThrow('Spot could not be reserved');

    const spotReservations = await spotReservationRepository.findAll();
    expect(spotReservations).toHaveLength(1);

    const orders = await orderRepository.findAll();
    expect(orders).toHaveLength(2);

    const cancelledOrder = orders.find(
      (order) => order.status === OrderStatus.CANCELLED,
    );
    expect(cancelledOrder).toBeDefined();

    const pendingOrder = orders.find(
      (order) => order.status === OrderStatus.PAID,
    );
    expect(pendingOrder).toBeDefined();

    await orm.close();
  });
});
