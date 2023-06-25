import { Module } from '@nestjs/common';
import { FundService } from './fund.service';
import { FundController } from './fund.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundEntity } from './entity/fund.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FundEntity])],
  controllers: [FundController],
  providers: [FundService],
})
export class FundModule {}
