import { CartEntity } from 'src/cart/entity/cart.entity';
import { BaseEntity } from 'src/config/baseEntity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity({ name: 'cart_item' })
export class CartItemEntity extends BaseEntity {
  @Column('uuid')
  productId: ProductEntity;

  @ManyToOne(() => ProductEntity, (product) => product.cartItem)
  product: ProductEntity;

  @Column('uuid')
  cartId: CartEntity;

  @ManyToOne(() => CartEntity, (cart) => cart.cartItems)
  cart: CartEntity;

  @Column()
  quantity: number;

  @Column()
  price: number;
}
