import { BaseEntity } from 'src/config/baseEntity';
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

  @Column('uuid')
  userId: UserEntity;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;
}
