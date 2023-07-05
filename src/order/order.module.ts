import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { ProductModule } from 'src/product/product.module';
import { VoucherModule } from 'src/voucher/voucher.module';
import { UserModule } from 'src/user/user.module';
import { FundModule } from 'src/fund/fund.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { UserRightModule } from 'src/user-right/user-right.module';
import { ProductEntity } from 'src/product/entity/product.entity';
import { WalletEntity } from 'src/wallet/entity/wallet.entity';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [
    TypeOrmModule.forFeature([OrderEntity, ProductEntity, WalletEntity]),
    ProductModule,
    VoucherModule,
    UserModule,
    FundModule,
    WalletModule,
    UserRightModule,
  ],
  exports: [OrderService],
})
export class OrderModule {}
