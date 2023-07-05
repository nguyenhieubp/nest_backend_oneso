import { Injectable } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { VoucherService } from 'src/voucher/voucher.service';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { Repository } from 'typeorm';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';
import { UserRightService } from '../user-right/user-right.service';
import * as dotenv from 'dotenv';
import { WalletService } from 'src/wallet/wallet.service';
import { WalletEntity } from 'src/wallet/entity/wallet.entity';
dotenv.config();

@Injectable()
export class OrderService {
  constructor(
    private readonly voucherService: VoucherService,
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly walletService: WalletService,
    private readonly userRightService: UserRightService,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,
  ) {}

  async generateOrderById(id: string): Promise<OrderEntity> {
    return this.orderRepository
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.user', 'user')
      .leftJoinAndSelect('orders.product', 'product')
      .leftJoinAndSelect('user.address', 'address')
      .where('orders.id =:id', { id: id })
      .getOne();
  }

  async createOrder(
    order: OrderDto,
    idUser: string,
  ): Promise<OrderEntity | string> {
    const { vouchers, ...dataOrder } = order;

    //GET PRICE VS QUANTITY PRODUCT
    const priceOrder = await this.productService.priceProduct(
      dataOrder.productId,
      dataOrder.quantity,
      dataOrder.type_pay,
    );

    //SAVE ORDER
    const newOrder = await this.orderRepository.save(dataOrder);

    //* percent discount order */
    const percentDiscount = await this.applyVoucher(
      order.vouchers,
      newOrder.id,
    );

    //SET PRICE ODER
    const priceOrderReal =
      Number(priceOrder) - Number(priceOrder) * (Number(percentDiscount) / 100);
    await this.orderRepository.save({ ...newOrder, price: priceOrderReal });

    /**CHECK USER REFERRAL CODE */
    await this.countMoneyForFriend(
      idUser,
      dataOrder.productId,
      dataOrder.type_pay,
      vouchers,
      dataOrder.quantity,
      priceOrderReal,
    );

    if (order.type_pay === 'online') {
      //SET MONEY USER
      const isSuccess = await this.setMoneyUserBuy(idUser, priceOrderReal);
      if (isSuccess === false) {
        return 'Not enough money';
      }
    }

    // CHECK USER USE VOUCHER FOR ORDER
    if (vouchers.length <= 0) {
      await this.orderRepository.save({ ...newOrder, price: priceOrder });
      if (order.type_pay === 'online') {
        //SET MONEY USER
        const isSuccess = await this.setMoneyUserBuy(idUser, priceOrder);
        if (isSuccess === false) {
          return 'Not enough money';
        }
      }
      return this.generateOrderById(newOrder.id);
    }
    //RETURN RESULT ORDER
    return this.generateOrderById(newOrder.id);
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

  /********* */
  /**COUNT MONEY FOR FRIEND AND GET MONEY TO WALLET */
  /********* */
  async countMoneyForFriend(
    id: string,
    productId: string,
    typePay: string,
    vouches: Array<string>,
    quantity: number,
    price: number,
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
        await this.userRightService.friendGetMoneyWhenByVoucher(
          productId,
          typePay,
          quantity,
          friend.level,
          friend.id,
          price,
        );
      } else if (user.level === 'T1' && !isUseVoucher) {
        await this.userRightService.friendGetMoneyWhenByNormal(
          productId,
          typePay,
          quantity,
          friend.level,
          friend.id,
          price,
        );
      }
      if (user.level === 'T2' && !isUseVoucher) {
        await this.userRightService.friendGetMoneyWhenByFriendT2(
          productId,
          typePay,
          quantity,
          friend.level,
          friend.id,
          price,
        );
      }
    }
  }

  async getAllOrder(): Promise<Array<OrderEntity>> {
    return this.orderRepository
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.user', 'user')
      .leftJoinAndSelect('orders.product', 'product')
      .leftJoinAndSelect('user.address', 'address')
      .getMany();
  }

  async getItemOrder(id: string): Promise<OrderEntity> {
    return await this.generateOrderById(id);
  }

  async getOrderByUserWait(id: string): Promise<Array<OrderEntity>> {
    return await this.orderRepository
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.user', 'user')
      .leftJoinAndSelect('orders.product', 'product')
      .leftJoinAndSelect('user.address', 'address')
      .where('orders.user =:userId AND orders.isPurchase = FALSE ', {
        userId: id,
      })
      .getMany();
  }

  async getOrderByUserSuccess(id: string): Promise<Array<OrderEntity>> {
    return await this.orderRepository
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.user', 'user')
      .leftJoinAndSelect('orders.product', 'product')
      .leftJoinAndSelect('user.address', 'address')
      .where('orders.user =:userId AND orders.isPurchase = TRUE ', {
        userId: id,
      })
      .getMany();
  }

  async commentOrder(id: string, comment: string): Promise<string> {
    const order = await this.orderRepository.findOneById(id);
    order.comment = comment;
    await this.orderRepository.save(order);
    return comment;
  }

  async deleteOrder(id: string): Promise<string> {
    await this.orderRepository.delete(id);
    return 'DELETE SUCCESS';
  }

  async setPurchaser(id: string): Promise<boolean> {
    const order = await this.orderRepository.findOneById(id);
    order.isPurchase = true;
    await this.orderRepository.save(order);
    return true;
  }

  async getAllOrderOnlineOfShop(id: string) {
    const orders = await this.orderRepository
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.product', 'product')
      .where(
        'product.shopId =:shopId AND orders.type_pay = :typePay AND  orders.isPurchase = FALSE ',
        {
          shopId: id,
          typePay: 'online',
        },
      )
      .getMany();
    return orders;
  }

  async getAllOrderOnlineOfShopPurchased(id: string) {
    const orders = await this.orderRepository
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.product', 'product')
      .where(
        'product.shopId =:shopId AND orders.type_pay = :typePay AND orders.isPurchase = TRUE',
        {
          shopId: id,
          typePay: 'online',
        },
      )
      .getMany();
    return orders;
  }

  async getAllOrderOfflineShop(id: string) {
    const orders = await this.orderRepository
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.product', 'product')
      .where(
        'product.shopId =:shopId AND orders.type_pay = :typePay AND orders.isPurchase = FALSE',
        {
          shopId: id,
          typePay: 'offline',
        },
      )
      .getMany();
    return orders;
  }

  async getAllOrderOfflineShopPurchased(id: string) {
    const orders = await this.orderRepository
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.product', 'product')
      .where('product.shopId =:shopId AND orders.type_pay = :typePay', {
        shopId: id,
        typePay: 'offline',
      })
      .getMany();
    return orders;
  }

  async setMoneyUserBuy(userId: string, price: number) {
    const wallet = await this.walletService.getWalletByUser(userId);
    if (wallet.consumer_wallet >= price) {
      wallet.consumer_wallet = wallet.consumer_wallet - price;
      await this.walletRepository.save(wallet);
      return true;
    } else {
      return false;
    }
  }
}
