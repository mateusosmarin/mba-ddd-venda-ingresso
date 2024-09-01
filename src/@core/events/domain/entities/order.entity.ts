import { AggregateRoot } from 'src/@core/common/domain/aggregate-root';
import { Uuid } from 'src/@core/common/domain/value-objects/uuid.vo';
import { EventSpotId } from './event-spot.entity';
import { CustomerId } from './customer.entity';

export class OrderId extends Uuid {}

export enum OrderStatus {
  PENDING,
  PAID,
  CANCELLED,
}

type OrderConstructorProps = {
  id?: OrderId | string;
  customer_id: CustomerId;
  amount: number;
  event_spot_id: EventSpotId;
  status: OrderStatus;
};

type CreateOrderCommand = {
  customer_id: CustomerId;
  amount: number;
  event_spot_id: EventSpotId;
};

export class Order extends AggregateRoot {
  id: OrderId;
  customer_id: CustomerId;
  amount: number;
  event_spot_id: EventSpotId;
  status: OrderStatus;

  constructor(props: OrderConstructorProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new OrderId(props.id)
        : (props.id ?? new OrderId());
    this.customer_id =
      props.customer_id instanceof CustomerId
        ? props.customer_id
        : new CustomerId(props.customer_id);
    this.amount = props.amount;
    this.event_spot_id =
      props.event_spot_id instanceof EventSpotId
        ? props.event_spot_id
        : new EventSpotId(props.event_spot_id);
    this.status = props.status;
  }

  static create(command: CreateOrderCommand) {
    return new Order({
      ...command,
      status: OrderStatus.PENDING,
    });
  }

  pay() {
    this.status = OrderStatus.PAID;
  }

  cancel() {
    this.status = OrderStatus.CANCELLED;
  }

  toJSON() {
    return {
      id: this.id.value,
      customer_id: this.customer_id.value,
      amount: this.amount,
      event_spot_id: this.event_spot_id.value,
      status: this.status,
    };
  }
}
