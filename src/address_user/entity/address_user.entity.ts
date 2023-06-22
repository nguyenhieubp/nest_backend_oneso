import { BaseEntity } from 'src/config/baseEntity';
import { OrderEntity } from 'src/order/entity/order.entity';
import { UserEntity } from 'src/user/user.entity/user.entity';
import { Column, Entity, OneToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity({ name: 'address_user' })
export class AddressUserEntity extends BaseEntity {
  @Column()
  city: string;

  @Column()
  address_line1: string;

  @Column()
  address_line2: string;
}
