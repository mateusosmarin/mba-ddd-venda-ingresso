import { Controller, Get } from '@nestjs/common';
import { OrderService } from 'src/@core/events/application/order.service';

@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrderService) {}

  @Get()
  list() {
    return this.orderService.list();
  }
}
