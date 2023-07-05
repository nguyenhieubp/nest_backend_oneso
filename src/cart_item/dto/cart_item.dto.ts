import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID, Min } from 'class-validator';
import { CartEntity } from 'src/cart/entity/cart.entity';
import { BaseDto } from 'src/config/baseDto';
import { ProductEntity } from 'src/product/entity/product.entity';

export class CartItemDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  productId: ProductEntity;

  @ApiProperty()
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  cartId: CartEntity;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  price: number;
}
