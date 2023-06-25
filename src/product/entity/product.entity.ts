import { CartItemEntity } from 'src/cart_item/entity/cart_item.entity';
import { BaseEntity } from 'src/config/baseEntity';
import { OrderEntity } from 'src/order/entity/order.entity';
import { ShopEntity } from 'src/shop/entity/shop.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { array: true })
  banner_products: string[];

  @Column()
  avatar_product: string;

  @Column()
  name_product: string;

  @Column({ default: '' })
  short_description: string;

  @Column({ default: '' })
  detailed_description: string;

  @Column()
  price_direct: number;

  @Column()
  discount_direct_price: number;

  @Column()
  price_online: number;

  @Column()
  discount_price_online: number;

  @Column({ nullable: true })
  category: string;

  @Column({ default: false })
  isShow: boolean;

  @Column('uuid')
  shopId: ShopEntity;

  @ManyToOne(() => ShopEntity, (shop) => shop.products)
  shop: ShopEntity;

  @OneToMany(() => CartItemEntity, (cart) => cart.product)
  cartItem: CartItemEntity[];

  @OneToMany(() => OrderEntity, (order) => order.product)
  orders: OrderEntity[];
}
