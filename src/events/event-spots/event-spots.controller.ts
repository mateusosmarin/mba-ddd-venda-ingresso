import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { EventService } from 'src/@core/events/application/event.service';
import { OrderService } from 'src/@core/events/application/order.service';

@Controller('events/:event_id/sections/:section_id/spots')
export class EventSpotsController {
  constructor(
    private eventService: EventService,
    private orderService: OrderService,
  ) {}

  @Get()
  list(
    @Param('event_id') eventId: string,
    @Param('section_id') sectionId: string,
  ) {
    return this.eventService.findSpots({
      event_id: eventId,
      section_id: sectionId,
    });
  }

  @Put(':spot_id')
  update(
    @Param('event_id') eventId: string,
    @Param('section_id') sectionId: string,
    @Param('spot_id') spotId: string,
    @Body() body: { location: string },
  ) {
    return this.eventService.updateLocation({
      event_id: eventId,
      section_id: sectionId,
      spot_id: spotId,
      location: body.location,
    });
  }

  @Put(':spot_id/reserve')
  reserve(
    @Param('event_id') eventId: string,
    @Param('section_id') sectionId: string,
    @Param('spot_id') spotId: string,
    @Body()
    body: {
      customer_id: string;
      card_token: string;
    },
  ) {
    return this.orderService.create({
      event_id: eventId,
      section_id: sectionId,
      spot_id: spotId,
      customer_id: body.customer_id,
      card_token: body.card_token,
    });
  }
}
