import { UnitOfWork } from 'src/@core/common/application/unit-of-work';
import { OrderRepository } from '../domain/repositories/order.repository';
import { CustomerRepository } from '../domain/repositories/customer.repository';
import { EventRepository } from '../domain/repositories/event.repository';
import { EventId } from '../domain/entities/event.entity';
import { CustomerId } from '../domain/entities/customer.entity';
import { EventSectionId } from '../domain/entities/event-section.entity';
import { EventSpotId } from '../domain/entities/event-spot.entity';
import { SpotReservationRepository } from '../domain/repositories/spot-reservation.repository';
import { SpotReservation } from '../domain/entities/spot-reservation.entity';
import { Order } from '../domain/entities/order.entity';
import { PaymentGateway } from './payment.gateway';

export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private customerRepository: CustomerRepository,
    private eventRepository: EventRepository,
    private spotReservationRepository: SpotReservationRepository,
    private paymentGateway: PaymentGateway,
    private uow: UnitOfWork,
  ) {}

  list() {
    return this.orderRepository.findAll();
  }

  async create(input: {
    event_id: string;
    section_id: string;
    spot_id: string;
    customer_id: string;
    card_token: string;
  }) {
    const customerId = new CustomerId(input.customer_id);
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }
    const eventId = new EventId(input.event_id);
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    const sectionId = new EventSectionId(input.section_id);
    const spotId = new EventSpotId(input.spot_id);
    if (!event.isSpotAvailable({ section_id: sectionId, spot_id: spotId })) {
      throw new Error('Spot not available');
    }
    const existingSpotReservation =
      await this.spotReservationRepository.findBySpotId(spotId);
    if (existingSpotReservation) {
      throw new Error('Spot already reserved');
    }
    return this.uow.runTransaction(async () => {
      const spotReservation = SpotReservation.create({
        spot_id: spotId,
        customer_id: customer.id,
      });
      await this.spotReservationRepository.add(spotReservation);
      const section = event.sections.find((section) =>
        section.id.equals(sectionId),
      );
      try {
        await this.uow.commit();
        await this.paymentGateway.pay({
          token: input.card_token,
          amount: section.price,
        });
        const order = Order.create({
          customer_id: customerId,
          event_spot_id: spotId,
          amount: section.price,
        });
        order.pay();
        await this.orderRepository.add(order);
        event.reserveSpot({
          section_id: sectionId,
          spot_id: spotId,
        });
        await this.uow.commit();
        return order;
      } catch (e) {
        const order = Order.create({
          customer_id: customerId,
          event_spot_id: spotId,
          amount: section.price,
        });
        order.cancel();
        await this.orderRepository.add(order);
        await this.uow.commit();
        throw new Error('Spot could not be reserved');
      }
    });
  }
}
