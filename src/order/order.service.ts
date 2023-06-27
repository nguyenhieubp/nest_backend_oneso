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
import { UserRightService } from '../user-right/user-right.service';
dotenv.config();

@Injectable()
export class OrderService {
  constructor(
    private readonly voucherService: VoucherService,
    private readonly productService: ProductService,
    private readonly walletService: WalletService,
    private readonly userService: UserService,
    private readonly fundService: FundService,
    private readonly userRight: UserRightService,
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

    //GET PRICE VS QUANTITY PRODUCT
    const priceOrder = await this.productService.priceProduct(
      dataOrder.productId,
      dataOrder.quantity,
      dataOrder.type_pay,
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

    //SET PRICE ODER
    const priceOrderReal =
      Number(priceOrder) - Number(priceOrder) * (Number(percentDiscount) / 100);
    await this.orderRepository.save({ ...newOrder, price: priceOrderReal });

    //******************* */
    //SHOP GET MONEY
    await this.walletShopUserBuy(
      dataOrder.productId,
      Number(priceOrderReal) -
        Number(
          await this.userRight.countFundDiscount(
            dataOrder.productId,
            dataOrder.type_pay,
            dataOrder.quantity,
          ),
        ),
    );

    /**CHECK USER REFERRAL CODE */
    await this.countMoneyForFriend(
      idUser,
      dataOrder.productId,
      dataOrder.type_pay,
      vouchers,
      dataOrder.quantity,
    );

    if (vouchers.length <= 0) {
      await this.orderRepository.save({ ...newOrder, price: priceOrder });
      /**CHECK USER REFERRAL CODE */
      await this.countMoneyForFriend(
        idUser,
        dataOrder.productId,
        dataOrder.type_pay,
        vouchers,
        dataOrder.quantity,
      );

      //SHOP GET MONEY
      await this.walletShopUserBuy(
        dataOrder.productId,
        Number(priceOrderReal) -
          Number(
            await this.userRight.countFundDiscount(
              dataOrder.productId,
              dataOrder.type_pay,
              dataOrder.quantity,
            ),
          ),
      );

      //RETURN RESULT ORDER
      return this.generateOrder(newOrder.id);
    }

    //RETURN RESULT ORDER
    return this.generateOrder(newOrder.id);
  }

  //**APPLY VOUCHERS */
  //**SET VOUCHER USE FOR ORDER SAVE DB */
  //**COUNT PERCENT DISCOUNT */
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

  //SET WALLET SHOP
  async walletShopUserBuy(id: string, money: number) {
    const product = await this.productService.getItemProduct(id);
    const wallet = await this.walletService.getWalletByShop(
      product.shopId.toString(),
    );
    await this.walletService.updateOnesoPayUp(wallet.id, money);
    return wallet;
  }

  /********* */
  /**COUNT MONEY FOR FRIEND AND GET MONEY TO WALLET */
  /********* */
  async countMoneyForFriend(
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
        await this.userRight.friendGetMoneyWhenByVoucher(
          productId,
          typePay,
          quantity,
          friend.level,
          friend.id,
        );
      } else if (user.level === 'T1' && !isUseVoucher) {
        await this.userRight.friendGetMoneyWhenByNormal(
          productId,
          typePay,
          quantity,
          friend.level,
          friend.id,
        );
      }
      if (user.level === 'T2' && !isUseVoucher) {
        await this.userRight.friendGetMoneyWhenByFriendT2(
          productId,
          typePay,
          quantity,
          friend.level,
          friend.id,
        );
      }
    }
  }
}
