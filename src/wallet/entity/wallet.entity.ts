import { BaseEntity } from 'src/config/baseEntity';
import { ShopEntity } from 'src/shop/entity/shop.entity';
import { UserEntity } from 'src/user/user.entity/user.entity';
import {
  Column,
  JoinTable,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Entity,
} from 'typeorm';

@Entity({ name: 'wallets' })
export class WalletEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 0 })
  //quỹ hoa hồng
  commission_fund: number;

  @Column({ default: 0 })
  consumer_wallet: number;

  @Column({ default: 0 })
  oneso_pay: number;

  @Column('uuid', { nullable: true })
  userId: UserEntity;

  @OneToOne(() => UserEntity, { nullable: true })
  @JoinColumn()
  user: UserEntity;

  @Column('uuid', { nullable: true })
  shopId: ShopEntity;

  @OneToOne(() => ShopEntity, { nullable: true })
  @JoinColumn()
  shop: ShopEntity;
}
