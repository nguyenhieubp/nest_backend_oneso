import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { Expose } from 'class-transformer';
import { BaseDto } from 'src/config/baseDto';
import { OrderEntity } from '../entity/order.entity';
import { AddressUserEntity } from 'src/address_user/entity/address_user.entity';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { UserEntity } from 'src/user/user.entity/user.entity';
import { ProductEntity } from 'src/product/entity/product.entity';

export class OrderDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @Expose()
  comment: string;

  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  type_pay: string;

  @ApiProperty()
  @Expose()
  vouchers: string[];

  @ApiProperty()
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
