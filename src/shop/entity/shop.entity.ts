import { BaseEntity } from 'src/config/baseEntity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'shops' })
export class ShopEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  shop_name: string;

  @Column({ default: '' })
  short_description: string;

  @Column({ default: '' })
  detailed_description: string;

  @Column()
  managed_shop: string;

  @Column()
  phone_number: string;

  @Column()
  email: string;

  @Column()
  city: string;

  @Column()
  district: string;

  @Column()
  specific_address: string;

  @Column()
  business_arena: string;

  @Column({ default: '' })
  referral_code: string;

  @Column({ default: '' })
  avatar_shop: string;

  @Column({ default: '' })
  banner_shop: string;

  @OneToMany(() => ProductEntity, (product) => product.shop)
  products: ProductEntity;
}
