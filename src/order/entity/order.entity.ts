import { AddressUserEntity } from 'src/address_user/entity/address_user.entity';
import { BaseEntity } from 'src/config/baseEntity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { UserEntity } from 'src/user/user.entity/user.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';

@Entity({ name: 'orders' })
export class OrderEntity extends BaseEntity {
  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column({ nullable: true })
  comment: string;

  @Column()
  type_pay: string;

  @OneToMany(() => VoucherEntity, (voucher) => voucher.order, {
    onDelete: 'CASCADE',
  })
  vouchers: VoucherEntity[];

  @Column('uuid')
  productId: string;

  @ManyToOne(() => ProductEntity, (product) => product.orders, {
    onDelete: 'CASCADE',
  })
  product: ProductEntity;

  @Column('uuid')
  userId: string;

  @Column('boolean', { default: false })
  isPurchase: boolean;

  @ManyToOne(() => UserEntity, (user) => user.orders, { onDelete: 'CASCADE' })
  user: UserEntity;
}
