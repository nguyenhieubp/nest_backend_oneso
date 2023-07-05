import { ApiBody } from '@nestjs/swagger/dist';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from './../user/guard/jwt.guard';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';
import { OrderEntity } from './entity/order.entity';

@Controller('order')
@ApiTags('Order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiBody({ type: OrderDto })
  @UseGuards(JwtGuard)
  createOrder(
    @Req() req,
    @Body() newOrder: OrderDto,
  ): Promise<OrderEntity | string> {
    const order = OrderDto.plainToClass(newOrder);
    return this.orderService.createOrder(order, req.user.id);
  }

  @Get()
  getAllOrder(): Promise<Array<OrderEntity>> {
    return this.orderService.getAllOrder();
  }

  @Get('item/:id')
  getItemOrder(@Param('id') id: string): Promise<OrderEntity> {
    return this.orderService.getItemOrder(id);
  }

  @Get('user/purchaser/false/:id')
  getOrderByUserWait(@Param('id') id: string): Promise<Array<OrderEntity>> {
    return this.orderService.getOrderByUserWait(id);
  }

  @Get('user/purchaser/true/:id')
  getOrderByUserSuccess(@Param('id') id: string): Promise<Array<OrderEntity>> {
    return this.orderService.getOrderByUserSuccess(id);
  }

  @Put('comment/order/:id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        comment: {
          type: 'string',
          description: 'comment',
        },
      },
    },
  })
  commentOrder(
    @Body('comment') comment: string,
    @Param('id') id: string,
  ): Promise<string> {
    return this.orderService.commentOrder(id, comment);
  }

  @Put('setIsPurchaser/:id')
  setPurchaser(@Param('id') id: string): Promise<boolean> {
    return this.orderService.setPurchaser(id);
  }

  @Delete(':id')
  deleteOrder(@Param('id') id: string): Promise<string> {
    return this.orderService.deleteOrder(id);
  }
}
