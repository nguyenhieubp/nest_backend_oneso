import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID, Min } from 'class-validator';
import { CartEntity } from 'src/cart/entity/cart.entity';
import { BaseDto } from 'src/config/baseDto';
import { ProductEntity } from 'src/product/entity/product.entity';

export class CartItemDto extends BaseDto {
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  productId: ProductEntity;

  @Expose()
  @IsUUID()
  @IsNotEmpty()
  cartId: CartEntity;

  @Expose()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @Expose()
  @IsNotEmpty()
  price: number;
}
