import { UserEntity } from './../user/user.entity/user.entity';
import { Injectable } from '@nestjs/common';
import { FundService } from 'src/fund/fund.service';
import { WalletService } from 'src/wallet/wallet.service';
import { ProductService } from 'src/product/product.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletEntity } from 'src/wallet/entity/wallet.entity';
import { ShopService } from 'src/shop/shop.service';
import { ShopEntity } from 'src/shop/entity/shop.entity';

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
    private readonly shopService: ShopService,
  ) {}

  async friendGetMoneyWhenByVoucher(
    productId: string,
    typePay: string,
    quantity: number,
    levelFriend: string,
    idFriend: string,
    price: number,
  ) {
    const moneyPolicy = await this.userUseVouchers(
      productId,
      typePay,
      quantity,
      price,
    );
    switch (levelFriend) {
      case 'T1':
        await this.walletService.updateCommissionUp(
          idFriend,
          Number(moneyPolicy * (10 / 100)),
        );
        return;
      case 'T2':
        await this.walletService.updateCommissionUp(
          idFriend,
          Number(moneyPolicy * (15 / 100)),
        );
        return;
      case 'T3':
        await this.walletService.updateCommissionUp(
          idFriend,
          Number(moneyPolicy * (20 / 100)),
        );
        return;
    }
  }

  async userUseVouchers(
    productId: string,
    typePay: string,
    quantity: number,
    price: number,
  ) {
    //GET MONEY DISCOUNT
    const moneyDiscount = await this.countFundDiscount(
      productId,
      typePay,
      quantity,
      price,
    );
    //POLICY FUND = 30% DISCOUNT FUND
    const policyFund = (30 / 100) * Number(moneyDiscount);

    //SAVE POLICY FUND
    await this.fundService.policyFundUp(process.env.FUND_MONEY, policyFund);
    return policyFund;
  }

  async friendGetMoneyWhenByNormal(
    productId: string,
    typePay: string,
    quantity: number,
    levelFriend: string,
    idFriend: string,
    price: number,
  ) {
    const moneyPolicy = await this.userNormalPurchase(
      productId,
      typePay,
      quantity,
      price,
    );
    switch (levelFriend) {
      case 'T1':
        await this.walletService.updateCommissionUp(
          idFriend,
          Number(moneyPolicy * (10 / 100)),
        );
        return;
      case 'T2':
        await this.walletService.updateCommissionUp(
          idFriend,
          Number(moneyPolicy * (15 / 100)),
        );
        return;
      case 'T3':
        await this.walletService.updateCommissionUp(
          idFriend,
          Number(moneyPolicy * (20 / 100)),
        );
        return;
    }
  }

  async userNormalPurchase(
    productId: string,
    typePay: string,
    quantity: number,
    price: number,
  ) {
    const moneyDiscount = await this.countFundDiscount(
      productId,
      typePay,
      quantity,
      price,
    );
    const policyFund = (30 / 100) * Number(moneyDiscount);
    await this.fundService.policyFundUp(process.env.FUND_MONEY, policyFund);
    return policyFund;
  }

  async friendGetMoneyWhenByFriendT2(
    productId: string,
    typePay: string,
    quantity: number,
    levelFriend: string,
    idFriend: string,
    price: number,
  ) {
    const moneyPolicy = await this.friendT2(
      productId,
      typePay,
      quantity,
      price,
    );
    switch (levelFriend) {
      case 'T1':
        await this.walletService.updateCommissionUp(
          idFriend,
          Number(moneyPolicy * (10 / 100)),
        );
        return;
      case 'T2':
        await this.walletService.updateCommissionUp(
          idFriend,
          Number(moneyPolicy * (15 / 100)),
        );
        return;
      case 'T3':
        await this.walletService.updateCommissionUp(
          idFriend,
          Number(moneyPolicy * (20 / 100)),
        );
        return;
    }
  }

  async friendT2(
    productId: string,
    typePay: string,
    quantity: number,
    price: number,
  ) {
    const moneyDiscount = await this.countFundDiscount(
      productId,
      typePay,
      quantity,
      price,
    );
    const policyFund = (30 / 100) * Number(moneyDiscount);
    await this.fundService.policyFundUp(process.env.FUND_MONEY, policyFund);
    return policyFund;
  }

  // GET VALUE COUNT DISCOUNT
  async countFundDiscount(
    productId: string,
    typePay: string,
    quantity: number,
    price: number,
  ) {
    const product = await this.productService.getItemProduct(productId);
    let moneyDiscount: number;

    if (typePay === 'online') {
      moneyDiscount =
        Number(product.price_online) *
        quantity *
        (Number(product.discount_price_online) / 100);
    } else if (typePay === 'offline') {
      moneyDiscount =
        Number(product.price_direct) *
        quantity *
        (Number(product.discount_direct_price) / 100);
    }

    //  QUỸ QUẢN TRỊ ĐƯỢC TRÍCH LẬP RA TỪ 20% QUỸ CHIẾT KHẤU
    // SAVE MANAGEMENT IN DB
    const managementFund = moneyDiscount * (20 / 100);
    await this.fundService.managerFundUp(
      process.env.FUND_MONEY,
      managementFund,
    );

    // SAVE DISCOUNT IN DB
    await this.fundService.discountFundUp(
      process.env.FUND_MONEY,
      moneyDiscount - managementFund,
    );

    //******************* */
    //SHOP GET MONEY
    await this.walletShopUserBuy(productId, price - moneyDiscount);
    await this.getPartnerEarningsFromSales(productId, managementFund);

    return moneyDiscount;
  }

  //**GET MONEY DISCOUNT */

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
      new Date().getMonth() - 1,
      1,
    );

    // Ngày cuối cùng của tháng
    const endDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
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

  async walletShopUserBuy(id: string, money: number) {
    const product = await this.productService.getItemProduct(id);
    const wallet = await this.walletService.getWalletByShop(
      product.shopId.toString(),
    );
    await this.walletService.updateOnesoPayUp(wallet.id, money);
    return wallet;
  }

  async getPartnerEarningsFromSales(id: string, managementFund: number) {
    const shopId: string = await this.productService.getShopByProduct(id);
    const shop: ShopEntity = await this.shopService.getShopById(shopId);
    const user: UserEntity = await this.userRepository.findOneBy({
      user_code: shop.referral_code,
    });
    const walletOfUser = await this.walletService.getWalletByUser(user.id);

    switch (user.level) {
      case 'T1':
        walletOfUser.consumer_wallet = (10 / 100) * managementFund;
        //SAVE DECREMENT VALUE
        await this.fundService.managerFundDown(
          process.env.FUND_MONEY,
          (10 / 100) * managementFund,
        );
        await this.walletRepository.save(walletOfUser);
        break;
      case 'T2':
        walletOfUser.consumer_wallet = (20 / 100) * managementFund;
        //SAVE DECREMENT VALUE
        await this.fundService.managerFundDown(
          process.env.FUND_MONEY,
          (20 / 100) * managementFund,
        );
        await this.walletRepository.save(walletOfUser);
        break;
      case 'T3':
        walletOfUser.consumer_wallet = (40 / 100) * managementFund;
        //SAVE DECREMENT VALUE
        await this.fundService.managerFundDown(
          process.env.FUND_MONEY,
          (40 / 100) * managementFund,
        );
        await this.walletRepository.save(walletOfUser);
        break;
    }
  }
}
