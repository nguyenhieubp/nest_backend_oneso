import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '../../config/baseEntity';
import { AddressUserEntity } from 'src/address_user/entity/address_user.entity';
import { OrderEntity } from 'src/order/entity/order.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column()
  email: string;

  @Column()
  name: string;

  @Column({ default: '' })
  phone_number: string;

  @Column()
  avatar: string;

  @Column({ default: 'user' })
  roles: string;

  @Column()
  user_code: string;

  @Column({ default: 'T1' })
  level: string;

  @Column({ default: '' })
  referral_code: string;

  @Column({ default: '' })
  refresh_token: string;

  @Column('uuid')
  addressId: AddressUserEntity;

  @OneToOne(() => AddressUserEntity)
  @JoinColumn()
  address: AddressUserEntity;

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];
}
