import { Body, Controller, Post, Get, Param } from '@nestjs/common';
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
}
