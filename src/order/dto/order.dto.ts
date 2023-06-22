import { Expose } from 'class-transformer';
import { BaseDto } from 'src/config/baseDto';
import { OrderEntity } from '../entity/order.entity';
import { AddressUserEntity } from 'src/address_user/entity/address_user.entity';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { UserEntity } from 'src/user/user.entity/user.entity';

export class OrderDto extends BaseDto {
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  user: UserEntity;

  @Expose()
  comment: string;

  @Expose()
  isBye: boolean;

  @Expose()
  isShipping: boolean;
}
