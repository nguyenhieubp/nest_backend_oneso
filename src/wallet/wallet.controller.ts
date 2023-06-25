import { Body, Controller, Post, Get, Param, Patch } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletDto } from './dto/wallet.dto';
import { WalletEntity } from './entity/wallet.entity';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  createWallet(@Body() walletData: WalletDto): Promise<WalletEntity> {
    const wallet = WalletDto.plainToClass(walletData);
    return this.walletService.createWallet(wallet);
  }

  @Get('user/:id')
  getWalletByUser(@Param('id') id: string): Promise<WalletEntity> {
    return this.walletService.getWalletByUser(id);
  }

  @Patch(':id/oneso_pay/up')
  async updateOnesoPayUp(
    @Param('id') id: string,
    @Body('money') money: number,
  ) {
    return await this.walletService.updateOnesoPayUp(id, money);
  }

  @Patch(':id/oneso_pay/down')
  async updateOnesoPayDown(
    @Param('id') id: string,
    @Body('money') money: number,
  ) {
    return await this.walletService.updateOnesoPayDown(id, money);
  }

  @Patch(':id/consumer_fund/down')
  async updateConsumerFundDown(
    @Param('id') id: string,
    @Body('money') money: number,
  ) {
    return await this.walletService.updateConsumerFundDown(id, money);
  }

  @Patch(':id/consumer_fund/up')
  async updateConsumerFundUp(
    @Param('id') id: string,
    @Body('money') money: number,
  ) {
    return await this.walletService.updateConsumerFundUp(id, money);
  }

  @Patch(':id/commission/down')
  async updateCommissionDown(
    @Param('id') id: string,
    @Body('money') money: number,
  ) {
    return await this.walletService.updateCommissionDown(id, money);
  }

  @Patch(':id/commission/up')
  async updateCommissionUp(
    @Param('id') id: string,
    @Body('money') money: number,
  ) {
    return await this.walletService.updateCommissionUp(id, money);
  }
}
