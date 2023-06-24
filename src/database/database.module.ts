import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity/user.entity';
import * as env from 'dotenv';
import * as process from 'process';
import { ShopEntity } from 'src/shop/entity/shop.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { OTPEntity } from 'src/otp/otp.entity';
import { WalletEntity } from 'src/wallet/entity/wallet.entity';
import { AddressUserEntity } from 'src/address_user/entity/address_user.entity';
import { FundEntity } from 'src/fund/entity/fund.entity';
import { OrderEntity } from 'src/order/entity/order.entity';
import { OrderItemEntity } from 'src/order_item/entity/order_item.entity';
import { CartEntity } from 'src/cart/entity/cart.entity';
import { CartItemEntity } from 'src/cart_item/entity/cart_item.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
env.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: Number(process.env.PORT),
      username: 'postgres',
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      entities: [
        UserEntity,
        ShopEntity,
        ProductEntity,
        OTPEntity,
        WalletEntity,
        AddressUserEntity,
        FundEntity,
        OrderItemEntity,
        OrderEntity,
        CartEntity,
        CartItemEntity,
        VoucherEntity,
      ],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
