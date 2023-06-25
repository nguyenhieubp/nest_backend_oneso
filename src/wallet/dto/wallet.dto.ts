import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { BaseDto } from 'src/config/baseDto';
import { UserEntity } from 'src/user/user.entity/user.entity';

export class WalletDto extends BaseDto {
  @Expose()
  commission_fund: number;

  @Expose()
  consumer_wallet: number;

  @Expose()
  oneso_pay: number;

  @Expose()
  @IsUUID()
  @IsNotEmpty()
  userId: UserEntity;
}
