import { Module, forwardRef } from '@nestjs/common';
import { UserRightService } from './user-right.service';
import { UserRightController } from './user-right.controller';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';
import { FundModule } from 'src/fund/fund.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity/user.entity';
import { WalletEntity } from 'src/wallet/entity/wallet.entity';
import { ShopService } from 'src/shop/shop.service';
import { ShopModule } from 'src/shop/shop.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [UserRightController],
  providers: [UserRightService],
  exports: [UserRightService],
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity, WalletEntity]),
    ProductModule,
    UserModule,
    FundModule,
    WalletModule,
    forwardRef(() => ShopModule),
  ],
})
export class UserRightModule {}
