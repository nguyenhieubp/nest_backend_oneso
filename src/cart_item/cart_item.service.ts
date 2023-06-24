import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItemEntity } from './entity/cart_item.entity';
import { Repository } from 'typeorm';
import { CartItemDto } from './dto/cart_item.dto';
import { ProductEntity } from 'src/product/entity/product.entity';
import { CartEntity } from 'src/cart/entity/cart.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { VoucherService } from 'src/voucher/voucher.service';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItemEntity)
    private readonly cartItemRepository: Repository<CartItemEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(CartEntity)
    private readonly CartRepository: Repository<CartEntity>,
    @InjectRepository(VoucherEntity)
    private readonly voucherRepository: Repository<VoucherEntity>,
    private readonly voucherService: VoucherService,
  ) {}

  async createCartItem(cartItem: CartItemDto): Promise<CartItemEntity> {
    const newCartItem = await this.cartItemRepository.save(cartItem);
    return await this.cartItemRepository
      .createQueryBuilder('cart_item')
      .leftJoinAndSelect('cart_item.product', 'product')
      .where('cart_item.id = :cartItemId', { cartItemId: newCartItem.id })
      .getOne();
  }

  async getByCart(id: string): Promise<Array<CartItemEntity>> {
    return await this.cartItemRepository
      .createQueryBuilder('cart_item')
      .leftJoinAndSelect('cart_item.product', 'product')
      .where('cart_item.cartId = :cartId', { cartId: id })
      .getMany();
  }

  async deleteCartItem(id: string): Promise<string> {
    await this.cartItemRepository.delete(id);
    return 'DELETE SUCCESS';
  }

  async getCartItem(id: string): Promise<CartItemEntity> {
    return this.cartItemRepository
      .createQueryBuilder('cart_item')
      .leftJoinAndSelect('cart_item.product', 'product')
      .where('cart_item.id =:id', { id: id })
      .getOne();
  }

  async updateQuantityUp(id: string): Promise<CartItemEntity> {
    const cartItem = await this.cartItemRepository.findOneById(id);
    const product = await this.productRepository.findOneById(
      cartItem.productId.toString(),
    );
    if (cartItem && cartItem.quantity >= 1) {
      cartItem.quantity += 1;
      cartItem.price = cartItem.quantity * product.price_online;
      await this.cartItemRepository.save(cartItem);
      return await this.cartItemRepository
        .createQueryBuilder('cart_item')
        .leftJoinAndSelect('cart_item.product', 'product')
        .where('cart_item.id =:id', { id: id })
        .getOne();
    }
  }

  async updateQuantityDown(id: string): Promise<CartItemEntity | string> {
    const cartItem = await this.cartItemRepository.findOneById(id);
    const product = await this.productRepository.findOneById(
      cartItem.productId.toString(),
    );
    if (cartItem && cartItem.quantity >= 2) {
      cartItem.quantity -= 1;
      cartItem.price = cartItem.quantity * product.price_online;
      await this.cartItemRepository.save(cartItem);
      return await this.cartItemRepository
        .createQueryBuilder('cart_item')
        .leftJoinAndSelect('cart_item.product', 'product')
        .where('cart_item.id =:id', { id: id })
        .getOne();
    } else {
      return 'Quantity than 1';
    }
  }
}
