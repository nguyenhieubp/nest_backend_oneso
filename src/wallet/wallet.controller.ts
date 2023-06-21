import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletDto } from './dto/wallet.dto';
import { WalletEntity } from './entity/wallet.entity';
import { v4 as uuidv4, parse as parseUUID } from 'uuid';

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
    const idUuid = parseUUID(id);
    return this.walletService.getWalletByUser(idUuid);
  }
}
