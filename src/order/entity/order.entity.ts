import { AddressUserEntity } from 'src/address_user/entity/address_user.entity';
import { BaseEntity } from 'src/config/baseEntity';
import { OrderItemEntity } from 'src/order_item/entity/order_item.entity';
import { UserEntity } from 'src/user/user.entity/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity({ name: 'orders' })
export class OrderEntity extends BaseEntity {
  @Column('uuid')
  userId: UserEntity;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
  orderItems: OrderEntity[];

  @Column()
  comment: string;
}
