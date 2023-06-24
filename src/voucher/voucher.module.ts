import { Module } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoucherEntity } from './entity/voucher.entity';

@Module({
  controllers: [VoucherController],
  providers: [VoucherService],
  imports: [TypeOrmModule.forFeature([VoucherEntity])],
  exports: [VoucherService],
})
export class VoucherModule {}
