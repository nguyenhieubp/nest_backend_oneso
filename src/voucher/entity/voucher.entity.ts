import { BaseEntity } from 'src/config/baseEntity';
import { OrderEntity } from 'src/order/entity/order.entity';
import { UserEntity } from 'src/user/user.entity/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'vouchers' })
export class VoucherEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  expiresAt: Date;

  @Column()
  value_discount: number;

  @Column({ default: 0 })
  isUse: boolean;

  @Column('uuid')
  userId: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.vouchers)
  user: UserEntity;

  @Column('uuid', { nullable: true })
  orderId: string;

  @ManyToOne(() => OrderEntity, (order) => order.vouchers, { nullable: true })
  order: OrderEntity;
}
