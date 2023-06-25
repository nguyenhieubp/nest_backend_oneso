import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';
import { OrderEntity } from './entity/order.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('by-voucher')
  orderByVoucher(@Body() newOrder: OrderDto): Promise<OrderDto> {
    const order = OrderDto.plainToClass(newOrder);
    return this.orderService.orderByVoucher(order);
  }
}
