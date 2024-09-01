import { Entity } from 'src/@core/common/domain/entity';
import { Uuid } from 'src/@core/common/domain/value-objects/uuid.vo';
import { EventSpot, EventSpotId } from './event-spot.entity';
import {
  AnyCollection,
  Collection,
  CollectionFactory,
} from 'src/@core/common/domain/collection';

export class EventSectionId extends Uuid {}

type EventSectionConstructorProps = {
  id?: EventSectionId;
  name: string;
  description: string | null;
  is_published: boolean;
  total_spots: number;
  total_spots_reserved: number;
  price: number;
};

type EventSectionCreateCommand = {
  name: string;
  description?: string | null;
  total_spots: number;
  price: number;
};

export class EventSection extends Entity {
  readonly id: EventSectionId;
  name: string;
  description: string | null;
  is_published: boolean;
  total_spots: number;
  total_spots_reserved: number;
  price: number;
  private _spots: Collection<EventSpot>;

  constructor(props: EventSectionConstructorProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new EventSectionId(props.id)
        : (props.id ?? new EventSectionId());
    this.name = props.name;
    this.description = props.description;
    this.is_published = props.is_published;
    this.total_spots = props.total_spots;
    this.total_spots_reserved = props.total_spots_reserved;
    this.price = props.price;
    this._spots = CollectionFactory.create<EventSpot>(this);
  }

  static create(command: EventSectionCreateCommand) {
    const section = new EventSection({
      ...command,
      description: command.description ?? null,
      is_published: false,
      total_spots_reserved: 0,
    });
    section.initSpots();
    return section;
  }

  private initSpots() {
    for (let i = 0; i < this.total_spots; i++) {
      this.spots.add(EventSpot.create());
    }
  }

  changeName(name: string) {
    this.name = name;
  }

  changeDescription(description: string) {
    this.description = description;
  }

  changePrice(price: number) {
    this.price = price;
  }

  publishAll() {
    this.publish();
    for (const spot of this.spots) {
      spot.publish();
    }
  }

  publish() {
    this.is_published = true;
  }

  unpublish() {
    this.is_published = false;
  }

  changeSpotLocation(command: { spot_id: EventSpotId; location: string }) {
    const spot = this.spots.find((spot) => spot.id.equals(command.spot_id));
    if (!spot) {
      throw new Error('Spot not found');
    }
    spot.changeLocation(command.location);
  }

  get spots(): Collection<EventSpot> {
    return this._spots;
  }

  set spots(spots: AnyCollection<EventSpot>) {
    this._spots = CollectionFactory.createFrom<EventSpot>(spots);
  }

  toJSON() {
    return {
      id: this.id.value,
      name: this.name,
      description: this.description,
      is_published: this.is_published,
      total_spots: this.total_spots,
      total_spots_reserved: this.total_spots_reserved,
      price: this.price,
      spots: [...this.spots].map((spot) => spot.toJSON()),
    };
  }
}
