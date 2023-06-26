import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { ProductModule } from 'src/product/product.module';
import { VoucherModule } from 'src/voucher/voucher.module';
import { UserModule } from 'src/user/user.module';
import { FundModule } from 'src/fund/fund.module';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    ProductModule,
    VoucherModule,
    UserModule,
    FundModule,
    WalletModule,
  ],
})
export class OrderModule {}
