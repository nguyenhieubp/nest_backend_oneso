import { JwtGuard } from './../user/guard/jwt.guard';
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';
import { OrderEntity } from './entity/order.entity';
import { Request } from 'express';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtGuard)
  orderByVoucher(@Req() req, @Body() newOrder: OrderDto): Promise<OrderEntity> {
    const order = OrderDto.plainToClass(newOrder);
    return this.orderService.orderByVoucher(order, req.user.id);
  }
}
