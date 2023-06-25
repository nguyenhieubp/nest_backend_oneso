import { Expose } from 'class-transformer';
import { BaseDto } from 'src/config/baseDto';
import { OrderEntity } from '../entity/order.entity';
import { AddressUserEntity } from 'src/address_user/entity/address_user.entity';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { UserEntity } from 'src/user/user.entity/user.entity';
import { ProductEntity } from 'src/product/entity/product.entity';

export class OrderDto extends BaseDto {
  @Expose()
  @IsNotEmpty()
  quantity: number;

  @Expose()
  @IsNotEmpty()
  price: number;

  @Expose()
  comment: string;

  @Expose()
  @IsNotEmpty()
  type_pay: string;

  @Expose()
  vouchers: string[];

  @Expose()
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @Expose()
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
