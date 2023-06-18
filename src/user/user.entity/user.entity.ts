import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../config/baseEntity';
import { ShopEntity } from 'src/shop/entity/shop.entity';

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
}
