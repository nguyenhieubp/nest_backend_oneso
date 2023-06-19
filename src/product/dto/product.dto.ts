import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { BaseDto } from 'src/config/baseDto';
import { ShopEntity } from 'src/shop/entity/shop.entity';

export class ProductDto extends BaseDto {
  @Expose()
  banner_products: string[];

  @Expose()
  avatar_product: string;

  @Expose()
  name_product: string;

  @Expose()
  short_description: string;

  @Expose()
  detailed_description: string;

  @Expose()
  price_direct: number;

  @Expose()
  discount_direct_price: number;

  @Expose()
  price_online: number;

  @Expose()
  discount_price_online: number;

  @Expose()
  category: string;

  @Expose()
  isShow: boolean;

  @IsUUID()
  @Expose()
  shopId: ShopEntity;
}
