import { Module } from '@nestjs/common';
import { UserRightService } from './user-right.service';
import { UserRightController } from './user-right.controller';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';
import { FundModule } from 'src/fund/fund.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity/user.entity';
import { WalletEntity } from 'src/wallet/entity/wallet.entity';

@Module({
  controllers: [UserRightController],
  providers: [UserRightService],
  exports: [UserRightService],
  imports: [
    TypeOrmModule.forFeature([UserEntity, WalletEntity]),
    ProductModule,
    UserModule,
    FundModule,
    WalletModule,
  ],
})
export class UserRightModule {}
