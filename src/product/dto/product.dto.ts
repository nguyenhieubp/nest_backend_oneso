import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { BaseDto } from 'src/config/baseDto';
import { ShopEntity } from 'src/shop/entity/shop.entity';
import { CateGory } from '../category.enum';

export class ProductDto extends BaseDto {
  @ApiProperty()
  @Expose()
  banner_products: string[];

  @ApiProperty()
  @Expose()
  avatar_product: string;

  @ApiProperty()
  @Expose()
  name_product: string;

  @ApiProperty()
  @Expose()
  short_description: string;

  @ApiProperty()
  @Expose()
  detailed_description: string;

  @ApiProperty()
  @Expose()
  price_direct: number;

  @ApiProperty()
  @Expose()
  discount_direct_price: number;

  @ApiProperty()
  @Expose()
  price_online: number;

  @ApiProperty()
  @Expose()
  discount_price_online: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  category: keyof CateGory;

  @ApiProperty()
  @Expose()
  isShow: boolean;

  @ApiProperty()
  @IsUUID()
  @Expose()
  shopId: ShopEntity;
}
