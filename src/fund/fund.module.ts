import { Module } from '@nestjs/common';
import { FundService } from './fund.service';
import { FundController } from './fund.controller';

@Module({
  controllers: [FundController],
  providers: [FundService]
})
export class FundModule {}
