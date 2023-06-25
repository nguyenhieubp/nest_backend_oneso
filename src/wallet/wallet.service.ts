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

  async getWalletByUser(id: string): Promise<WalletEntity> {
    return await this.walletRepository
      .createQueryBuilder('wallets')
      .where('wallets.user =:id', { id: id })
      .getOne();
  }

  async updateOnesoPayUp(
    id: string,
    money: number,
  ): Promise<WalletEntity | string> {
    const wallet = await this.walletRepository.findOneById(id);
    if (money < 0) {
      return 'Need greater than 0';
    }
    wallet.oneso_pay += money;
    await this.walletRepository.save(wallet);
    return await this.walletRepository.findOneById(id);
  }

  async updateOnesoPayDown(
    id: string,
    money: number,
  ): Promise<WalletEntity | string> {
    const wallet = await this.walletRepository.findOneById(id);
    if (wallet.oneso_pay < money) {
      return 'Account not enough';
    }
    wallet.oneso_pay -= money;
    await this.walletRepository.save(wallet);
    return await this.walletRepository.findOneById(id);
  }

  async updateConsumerFundUp(
    id: string,
    money: number,
  ): Promise<WalletEntity | string> {
    const wallet = await this.walletRepository.findOneById(id);
    if (money < 0) {
      return 'Need greater than 0';
    }
    wallet.consumer_wallet += money;
    await this.walletRepository.save(wallet);
    return await this.walletRepository.findOneById(id);
  }

  async updateConsumerFundDown(
    id: string,
    money: number,
  ): Promise<WalletEntity | string> {
    const wallet = await this.walletRepository.findOneById(id);
    if (wallet.consumer_wallet < money) {
      return 'Account not enough';
    }
    wallet.consumer_wallet -= money;
    await this.walletRepository.save(wallet);
    return await this.walletRepository.findOneById(id);
  }

  async updateCommissionDown(
    id: string,
    money: number,
  ): Promise<WalletEntity | string> {
    const wallet = await this.walletRepository.findOneById(id);
    if (wallet.commission_fund < money) {
      return 'Account not enough';
    }
    wallet.commission_fund -= money;
    await this.walletRepository.save(wallet);
    return await this.walletRepository.findOneById(id);
  }

  async updateCommissionUp(
    id: string,
    money: number,
  ): Promise<WalletEntity | string> {
    const wallet = await this.walletRepository.findOneById(id);
    if (money < 0) {
      return 'Account not enough';
    }
    wallet.commission_fund += money;
    await this.walletRepository.save(wallet);
    return await this.walletRepository.findOneById(id);
  }
}
