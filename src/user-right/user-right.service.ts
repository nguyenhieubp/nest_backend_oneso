import { UserEntity } from './../user/user.entity/user.entity';
import { Injectable } from '@nestjs/common';
import { FundService } from 'src/fund/fund.service';
import { WalletService } from 'src/wallet/wallet.service';
import { ProductService } from 'src/product/product.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletEntity } from 'src/wallet/entity/wallet.entity';

@Injectable()
export class UserRightService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,
    private readonly productService: ProductService,
    private readonly walletService: WalletService,
    private readonly fundService: FundService,
  ) {}

  async friendGetMoneyWhenByVoucher(
    productId: string,
    typePay: string,
    quantity: number,
    levelFriend: string,
    idFriend: string,
  ) {
    const moneyCommission = await this.userUseVouchers(
      productId,
      typePay,
      quantity,
    );
    switch (levelFriend) {
      case 'T1':
        await this.walletService.updateCommissionUp(
          idFriend,
          Number(moneyCommission * (10 / 100)),
        );
        return;
      case 'T2':
        await this.walletService.updateCommissionUp(
          idFriend,
          Number(moneyCommission * (15 / 100)),
        );
        return;
      case 'T3':
        await this.walletService.updateCommissionUp(
          idFriend,
          Number(moneyCommission * (20 / 100)),
        );
        return;
    }
  }

  async userUseVouchers(productId: string, typePay: string, quantity: number) {
    const moneyDiscount = await this.countFundDiscount(
      productId,
      typePay,
      quantity,
    );
    const policyFund = (15 / 100) * Number(moneyDiscount);
    await this.fundService.policyFundUp(
      process.env.FUND_MONEY,
      (85 / 100) * Number(moneyDiscount),
    );
    return policyFund;
  }

  async friendGetMoneyWhenByNormal(
    productId: string,
    typePay: string,
    quantity: number,
    levelFriend: string,
    idFriend: string,
  ) {
    const moneyCommission = await this.userNormalPurchase(
      productId,
      typePay,
      quantity,
    );
    switch (levelFriend) {
      case 'T1':
        await this.walletService.updateCommissionUp(
          idFriend,
          Number(moneyCommission * (10 / 100)),
        );
        return;
      case 'T2':
        await this.walletService.updateCommissionUp(
          idFriend,
          Number(moneyCommission * (15 / 100)),
        );
        return;
      case 'T3':
        await this.walletService.updateCommissionUp(
          idFriend,
          Number(moneyCommission * (20 / 100)),
        );
        return;
    }
  }

  async userNormalPurchase(
    productId: string,
    typePay: string,
    quantity: number,
  ) {
    const moneyDiscount = await this.countFundDiscount(
      productId,
      typePay,
      quantity,
    );
    const policyFund = (30 / 100) * Number(moneyDiscount);
    await this.fundService.policyFundUp(
      process.env.FUND_MONEY,
      (70 / 100) * Number(moneyDiscount),
    );
    return policyFund;
  }

  async friendGetMoneyWhenByFriendT2(
    productId: string,
    typePay: string,
    quantity: number,
    levelFriend: string,
    idFriend: string,
  ) {
    const moneyCommission = await this.friendT2(productId, typePay, quantity);
    switch (levelFriend) {
      case 'T1':
        await this.walletService.updateCommissionUp(
          idFriend,
          Number(moneyCommission * (10 / 100)),
        );
        return;
      case 'T2':
        await this.walletService.updateCommissionUp(
          idFriend,
          Number(moneyCommission * (15 / 100)),
        );
        return;
      case 'T3':
        await this.walletService.updateCommissionUp(
          idFriend,
          Number(moneyCommission * (20 / 100)),
        );
        return;
    }
  }

  async friendT2(productId: string, typePay: string, quantity: number) {
    const moneyDiscount = await this.countFundDiscount(
      productId,
      typePay,
      quantity,
    );
    const policyFund = (50 / 100) * Number(moneyDiscount);
    await this.fundService.policyFundUp(
      process.env.FUND_MONEY,
      (50 / 100) * Number(moneyDiscount),
    );
    return policyFund;
  }

  //GET VALUE COUNT DISCOUNT
  async countFundDiscount(
    productId: string,
    typePay: string,
    quantity: number,
  ) {
    const product = await this.productService.getItemProduct(productId);

    if (typePay === 'online') {
      const moneyDiscount =
        Number(product.price_online) *
        quantity *
        (Number(product.discount_price_online) / 100);
      await this.fundService.discountFundUp(
        process.env.FUND_MONEY,
        moneyDiscount,
      );

      return moneyDiscount;
    } else if (typePay === 'offline') {
      const moneyDiscount =
        Number(product.price_direct) *
        quantity *
        (Number(product.discount_direct_price) / 100);
      await this.fundService.discountFundUp(
        process.env.FUND_MONEY,
        moneyDiscount,
      );
      return moneyDiscount;
    }
  }

  async consumerWalletSharingIncome(id: string) {
    //GET USER
    const user = await this.userRepository.findOneById(id);

    //GET ALL FRIEND REFERRAL CODE
    const friends = await this.userRepository.findBy({
      referral_code: user.user_code,
    });

    //GET ALL WALLETS
    const wallets = await Promise.all(
      friends.map(async (friend) => {
        return this.walletService.getWalletByUser(friend.id);
      }),
    );

    //*GET 10% TOTAL MONEY FRIEND RECEIVE IN MONTH */
    const moneys = await Promise.all(
      wallets.map(async (wallet) => {
        return await this.getAllMoneyFriendGetInMonth(wallet.id);
      }),
    );

    //**TOTAL MONEY USER RECEIVE */
    const totalMoneyUserReceive = moneys.reduce(
      (sum, money) => (sum += money),
      0,
    );

    //SAVE IN DB
    await this.walletService.updateConsumerFundUp(
      user.id,
      totalMoneyUserReceive,
    );

    return totalMoneyUserReceive;
  }

  //**************************************** */
  //**COUNT MONEY FRIEND RECEIVE IN 1 MONTH */
  //**************************************** */
  async getAllMoneyFriendGetInMonth(id: string) {
    // Ngày đầu tiên của tháng
    const startDate = new Date(
      new Date().getFullYear(),
      //   new Date().getMonth() - 1,
      5,
      1,
    );

    // Ngày cuối cùng của tháng
    const endDate = new Date(
      new Date().getFullYear(),
      //   new Date().getMonth(),
      5,
      30,
    );

    //**SUM MONEY BETWEEN START DATE AND END DATE IN MONTH */
    const result = await this.walletRepository
      .createQueryBuilder('wallets')
      .select('SUM(wallets.commission_fund)', 'totalCommissionFund')
      .where('wallets.id = :id', { id: id })
      .andWhere('wallets.create_at BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getRawOne();

    const totalCommissionFund = result ? result.totalCommissionFund : 0;

    return totalCommissionFund * (10 / 100);
  }
}
