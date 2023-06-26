import { Injectable } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { VoucherService } from 'src/voucher/voucher.service';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { Repository } from 'typeorm';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';
import { FundService } from 'src/fund/fund.service';
import * as dotenv from 'dotenv';
import { WalletService } from 'src/wallet/wallet.service';
dotenv.config();

@Injectable()
export class OrderService {
  constructor(
    private readonly voucherService: VoucherService,
    private readonly productService: ProductService,
    private readonly walletService: WalletService,
    private readonly userService: UserService,
    private readonly fundService: FundService,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async generateOrder(id: string): Promise<OrderEntity> {
    return this.orderRepository
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.user', 'user')
      .leftJoinAndSelect('orders.product', 'product')
      .leftJoinAndSelect('user.address', 'address')
      .where('orders.id =:id', { id: id })
      .getOne();
  }

  async orderByVoucher(order: OrderDto, idUser: string): Promise<OrderEntity> {
    const { vouchers, ...dataOrder } = order;
    await this.checkWalletShop(order.productId);

    //GET PRICE VS QUANTITY PRODUCT
    const priceOrder = await this.productService.priceProduct(
      dataOrder.price,
      dataOrder.quantity,
    );

    //SAVE ORDER
    const newOrder = await this.orderRepository.save(dataOrder);

    //******************* */
    //******************* */
    //******************* */
    //* percent discount order */
    const percentDiscount = await this.applyVoucher(
      order.vouchers,
      newOrder.id,
    );
    if (vouchers.length <= 0) {
      await this.orderRepository.save({ ...newOrder, price: priceOrder });
      /**CHECK USER REFERRAL CODE */
      await this.checkUserReferralCode(
        idUser,
        dataOrder.productId,
        dataOrder.type_pay,
        vouchers,
        dataOrder.quantity,
      );

      //RETURN RESULT ORDER
      return this.generateOrder(newOrder.id);
    }

    const priceOrderReal = Number(priceOrder) * (Number(percentDiscount) / 100);
    await this.orderRepository.save({ ...newOrder, price: priceOrderReal });

    //******************* */

    /**CHECK USER REFERRAL CODE */
    await this.checkUserReferralCode(
      idUser,
      dataOrder.productId,
      dataOrder.type_pay,
      vouchers,
      dataOrder.quantity,
    );

    //RETURN RESULT ORDER
    return this.generateOrder(newOrder.id);
  }

  async applyVoucher(vouchers: string[], orderId: string): Promise<number> {
    //SET DATABASE VOUCHER APPLY ORDER
    vouchers.map((item) => {
      this.voucherService.setUseVoucher(item, orderId);
    });
    //COUNT PERCENT DISCOUNT
    const arrPercentDiscount = await Promise.all(
      vouchers.map(async (item) => {
        return this.voucherService.getItemVoucher(item);
      }),
    );
    const percentDiscount = arrPercentDiscount.reduce((sum, item) => {
      return (sum += item);
    }, 0);
    return percentDiscount;
  }

  async checkUserReferralCode(
    id: string,
    productId: string,
    typePay: string,
    vouches: Array<string>,
    quantity: number,
  ) {
    const user = await this.userService.findUserById(id);
    //CHECK USER USE VOUCHER
    const isUseVoucher = vouches.length === 0 ? false : true;

    //CHECK USER REFERRAL
    if (user.referral_code) {
      const friend = await this.userService.findUserByReferralCode(
        user.referral_code,
      );

      //IF USER USE VOUCHER
      if (isUseVoucher) {
        if (friend.level === 'T1') {
          const moneyCommission = await this.userUseVouchers(
            productId,
            typePay,
            quantity,
          );
          await this.walletService.updateCommissionUp(
            friend.id,
            Number(moneyCommission * (10 / 100)),
          );
          return moneyCommission;
        } else if (friend.level === 'T2') {
          const moneyCommission = await this.userUseVouchers(
            productId,
            typePay,
            quantity,
          );
          await this.walletService.updateCommissionUp(
            friend.id,
            Number(moneyCommission * (15 / 100)),
          );

          return moneyCommission * (15 / 100);
        } else if (friend.level === 'T3') {
          const moneyCommission = await this.userUseVouchers(
            productId,
            typePay,
            quantity,
          );
          await this.walletService.updateCommissionUp(
            friend.id,
            Number(moneyCommission * (20 / 100)),
          );
          return moneyCommission;
        }
      } else {
        if (friend.level === 'T1') {
          const moneyCommission = await this.countFundDiscount(
            productId,
            typePay,
            quantity,
          );
          await this.walletService.updateCommissionUp(
            friend.id,
            Number(moneyCommission * (30 / 100) * (10 / 100)),
          );
          //FUNDPOLICY
          await this.fundService.policyFundUp(
            process.env.FUND_MONEY,
            moneyCommission * (70 / 100),
          );
          return Number(moneyCommission * (30 / 100) * (10 / 100));
        } else if (friend.level === 'T2') {
          const moneyCommission = await this.countFundDiscount(
            productId,
            typePay,
            quantity,
          );
          await this.walletService.updateCommissionUp(
            friend.id,
            Number(moneyCommission * (30 / 100) * (15 / 100)),
          );
          //FUNDPOLICY
          await this.fundService.policyFundUp(
            process.env.FUND_MONEY,
            moneyCommission * (70 / 100),
          );
          return Number(moneyCommission * (30 / 100) * (15 / 100));
        } else if (friend.level === 'T3') {
          const moneyCommission = await this.countFundDiscount(
            productId,
            typePay,
            quantity,
          );
          await this.walletService.updateCommissionUp(
            friend.id,
            Number(moneyCommission * (30 / 100) * (20 / 100)),
          );
          //FUNDPOLICY
          await this.fundService.policyFundUp(
            process.env.FUND_MONEY,
            moneyCommission * (70 / 100),
          );
          return Number(moneyCommission * (30 / 100) * (20 / 100));
        }
      }
      if (user.level === 'T2') {
        if (friend.level === 'T1') {
          const moneyCommission = await this.countFundDiscount(
            productId,
            typePay,
            quantity,
          );
          await this.walletService.updateCommissionUp(
            friend.id,
            Number(moneyCommission * (50 / 100) * (10 / 100)),
          );
          //FUNDPOLICY
          await this.fundService.policyFundUp(
            process.env.FUND_MONEY,
            moneyCommission * (50 / 100),
          );
          return Number(moneyCommission * (50 / 100) * (10 / 100));
        } else if (friend.level === 'T2') {
          const moneyCommission = await this.countFundDiscount(
            productId,
            typePay,
            quantity,
          );
          await this.walletService.updateCommissionUp(
            friend.id,
            Number(moneyCommission * (50 / 100) * (15 / 100)),
          );
          //FUNDPOLICY
          await this.fundService.policyFundUp(
            process.env.FUND_MONEY,
            moneyCommission * (50 / 100),
          );
          return Number(moneyCommission * (50 / 100) * (15 / 100));
        } else if (friend.level === 'T3') {
          const moneyCommission = await this.countFundDiscount(
            productId,
            typePay,
            quantity,
          );
          await this.walletService.updateCommissionUp(
            friend.id,
            Number(moneyCommission * (50 / 100) * (20 / 100)),
          );
          //FUNDPOLICY
          await this.fundService.policyFundUp(
            process.env.FUND_MONEY,
            moneyCommission * (50 / 100),
          );
          return Number(moneyCommission * (50 / 100) * (20 / 100));
        }
      }
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

  async checkWalletShop(id: string) {
    const product = await this.productService.getItemProduct(id);
    // const wallet = await this.walletService.getWalletByUser(
    //   product.shopId.toString(),
    // );
    console.log(product.shop);
  }
}
