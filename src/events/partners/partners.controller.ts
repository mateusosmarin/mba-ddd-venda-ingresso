import { Body, Controller, Get, Post } from '@nestjs/common';
import { PartnerService } from 'src/@core/events/application/partner.service';

@Controller('partners')
export class PartnersController {
  constructor(private partnerService: PartnerService) {}

  @Get()
  list() {
    return this.partnerService.list();
  }

  @Post()
  create(@Body() body: { name: string }) {
    return this.partnerService.register({ name: body.name });
  }
}
