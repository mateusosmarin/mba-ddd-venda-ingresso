import { AggregateRoot } from 'src/@core/common/domain/aggregate-root';
import { CustomerId } from './customer.entity';
import { EventSpotId } from './event-spot.entity';
import { Uuid } from 'src/@core/common/domain/value-objects/uuid.vo';

export class SpotReservationId extends Uuid {}

type SpotReservationConstructorProps = {
  id?: SpotReservationId | string;
  spot_id: EventSpotId | string;
  reservation_date: Date;
  customer_id: CustomerId | string;
};

type CreateSpotReservation = {
  spot_id: EventSpotId;
  customer_id: CustomerId;
};

export class SpotReservation extends AggregateRoot {
  id: SpotReservationId;
  spot_id: EventSpotId;
  customer_id: CustomerId;
  reservation_date: Date;

  constructor(props: SpotReservationConstructorProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new SpotReservationId(props.id)
        : (props.id ?? new SpotReservationId());
    this.spot_id =
      props.spot_id instanceof EventSpotId
        ? props.spot_id
        : new EventSpotId(props.spot_id);
    this.customer_id =
      props.customer_id instanceof CustomerId
        ? props.customer_id
        : new CustomerId(props.customer_id);
    this.reservation_date = props.reservation_date;
  }

  static create(command: CreateSpotReservation) {
    return new SpotReservation({
      spot_id: command.spot_id,
      customer_id: command.customer_id,
      reservation_date: new Date(),
    });
  }

  changeReservation(customer_id: CustomerId) {
    this.customer_id = customer_id;
    this.reservation_date = new Date();
  }

  toJSON() {
    return {
      spot_id: this.spot_id.value,
      reservation_date: this.reservation_date,
      customer_id: this.customer_id.value,
    };
  }
}
