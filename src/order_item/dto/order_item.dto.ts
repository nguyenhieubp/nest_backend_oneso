import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID, Min } from 'class-validator';
import { BaseDto } from 'src/config/baseDto';
import { OrderEntity } from 'src/order/entity/order.entity';
import { ProductEntity } from 'src/product/entity/product.entity';

export class OrderItemDto extends BaseDto {
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  product: ProductEntity;

  @Expose()
  @IsNotEmpty()
  price: number;

  @Expose({ groups: ['online', 'offline'] })
  @IsNotEmpty()
  optionBuy: string;

  @Expose()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @Expose()
  @IsUUID()
  @IsNotEmpty()
  order: OrderEntity;
}
