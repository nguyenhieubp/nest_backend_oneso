import { BaseEntity } from 'src/config/baseEntity';
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

  @Column('uuid')
  userId: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.vouchers)
  user: UserEntity;
}
