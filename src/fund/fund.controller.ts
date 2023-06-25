import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { FundService } from './fund.service';
import { FundDto } from './dto/fund.dto';

@Controller('fund')
export class FundController {
  constructor(private readonly fundService: FundService) {}

  @Post()
  createFund(@Body() dataFund: FundDto) {
    const fund = FundDto.plainToClass(dataFund);
    return this.fundService.createFund(fund);
  }

  @Patch('discount/up/:id')
  discountFundUp(@Param('id') id: string, @Body('money') money: number) {
    return this.fundService.discountFundUp(id, money);
  }

  @Patch('discount/down/:id')
  discountFundDown(@Param('id') id: string, @Body('money') money: number) {
    return this.fundService.discountFundDown(id, money);
  }

  @Patch('policy/up/:id')
  policyFundUp(@Param('id') id: string, @Body('money') money: number) {
    return this.fundService.policyFundUp(id, money);
  }

  @Patch('policy/down/:id')
  policyFundDown(@Param('id') id: string, @Body('money') money: number) {
    return this.fundService.policyFundDown(id, money);
  }

  @Patch('manage/up/:id')
  manageFundUp(@Param('id') id: string, @Body('money') money: number) {
    return this.fundService.managerFundUp(id, money);
  }

  @Patch('manage/down/:id')
  manageFundDown(@Param('id') id: string, @Body('money') money: number) {
    return this.fundService.managerFundDown(id, money);
  }
}
