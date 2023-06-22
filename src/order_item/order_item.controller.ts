import { Body, Controller, Post } from '@nestjs/common';
import { OrderItemService } from './order_item.service';
import { OrderItemDto } from './dto/order_item.dto';

@Controller('order-item')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post()
  createOrderItem(@Body() orderItem: OrderItemDto) {
    console.log(orderItem);
  }
}
