import { Module } from '@nestjs/common';
import { CartItemService } from './cart_item.service';
import { CartItemController } from './cart_item.controller';

@Module({
  controllers: [CartItemController],
  providers: [CartItemService]
})
export class CartItemModule {}
