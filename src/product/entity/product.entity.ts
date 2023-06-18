import { BaseEntity } from 'src/config/baseEntity';
import { ShopEntity } from 'src/shop/entity/shop.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'products' })
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { array: true })
  banner_products: string[];

  @Column()
  avatar_product: string;

  @Column()
  name_product: string;

  @Column({ default: '' })
  short_description: string;

  @Column({ default: '' })
  detailed_description: string;

  @Column()
  price_direct: number;

  @Column()
  discount_direct_price: number;

  @Column()
  price_online: number;

  @Column()
  discount_price_online: number;

  @Column()
  category: string;

  @Column()
  isShow: boolean;

  @Column('uuid')
  shopId: ShopEntity;

  @ManyToOne(() => ShopEntity, (shop) => shop.products)
  shop: ShopEntity;
}
