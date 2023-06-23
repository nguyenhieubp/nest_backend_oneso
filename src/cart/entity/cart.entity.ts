import { CartItemEntity } from 'src/cart_item/entity/cart_item.entity';
import { BaseEntity } from 'src/config/baseEntity';
import { UserEntity } from 'src/user/user.entity/user.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

@Entity({ name: 'cart' })
export class CartEntity extends BaseEntity {
  @Column('uuid')
  userId: UserEntity;

  @OneToOne(() => UserEntity)
  user: UserEntity;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart)
  cartItems: CartItemEntity[];
}
