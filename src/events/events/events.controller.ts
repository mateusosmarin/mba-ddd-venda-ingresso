import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { EventService } from 'src/@core/events/application/event.service';
import { CreateEventDto } from './create-event.dto';

@Controller('events')
export class EventsController {
  constructor(private eventService: EventService) {}

  @Get()
  list() {
    return this.eventService.list();
  }

  @Post()
  create(@Body() body: CreateEventDto) {
    return this.eventService.create({
      name: body.name,
      description: body.description,
      date: body.date,
      partner_id: body.partner_id,
    });
  }

  @Put(':event_id/publish')
  publish(@Param('event_id') eventId: string) {
    return this.eventService.publishAll({ event_id: eventId });
  }
}
