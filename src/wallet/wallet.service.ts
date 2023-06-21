import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletEntity } from './entity/wallet.entity';
import { Repository } from 'typeorm';
import { WalletDto } from './dto/wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,
  ) {}

  async createWallet(wallet: WalletDto): Promise<WalletEntity> {
    return await this.walletRepository.save(wallet);
  }

  async getWalletByUser(id: string): Promise<WalletEntity> {}
}
