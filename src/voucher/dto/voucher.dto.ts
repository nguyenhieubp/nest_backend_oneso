import { Expose } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsUUID } from 'class-validator';
import { BaseDto } from 'src/config/baseDto';
import { OrderEntity } from 'src/order/entity/order.entity';
import { UserEntity } from 'src/user/user.entity/user.entity';

export class VoucherDto extends BaseDto {
  @Expose()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsInt()
  expiresInDay: number;

  @Expose()
  @IsNotEmpty()
  value_discount: number;

  @Expose()
  @IsNotEmpty()
  @IsUUID()
  userId: UserEntity;

  @Expose()
  orderId: string;
}
