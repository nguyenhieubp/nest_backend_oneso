import { Module } from '@nestjs/common';
import { CartItemService } from './cart_item.service';
import { CartItemController } from './cart_item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemEntity } from './entity/cart_item.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from 'src/config/transform.interceptor';
import { ProductEntity } from 'src/product/entity/product.entity';
import { CartEntity } from 'src/cart/entity/cart.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { VoucherModule } from 'src/voucher/voucher.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CartItemEntity,
      ProductEntity,
      CartEntity,
      VoucherEntity,
    ]),
    VoucherModule,
  ],
  controllers: [CartItemController],
  providers: [CartItemService],
})
export class CartItemModule {}
