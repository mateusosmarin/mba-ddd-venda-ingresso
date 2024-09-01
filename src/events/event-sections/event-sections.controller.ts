import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { EventService } from 'src/@core/events/application/event.service';
import { AddEventSectionDto } from './add-event-section.dto';
import { UpdateEventSectionDto } from './update-event-section.dto';

@Controller('events/:event_id/sections')
export class EventSectionsController {
  constructor(private eventService: EventService) {}

  @Get()
  list(@Param('event_id') eventId: string) {
    return this.eventService.findSections(eventId);
  }

  @Post()
  create(@Param('event_id') eventId: string, @Body() body: AddEventSectionDto) {
    return this.eventService.addSection({
      event_id: eventId,
      name: body.name,
      description: body.description,
      total_spots: body.total_spots,
      price: body.price,
    });
  }

  @Patch(':section_id')
  patch(
    @Param('event_id') eventId: string,
    @Param('section_id') sectionId: string,
    @Body() body: UpdateEventSectionDto,
  ) {
    return this.eventService.updateSection({
      event_id: eventId,
      section_id: sectionId,
      name: body.name,
      description: body.description,
    });
  }
}
