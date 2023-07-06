import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { BaseDto } from 'src/config/baseDto';
import { ShopEntity } from 'src/shop/entity/shop.entity';

export class WalletDto extends BaseDto {
  @Expose()
  commission_fund: number;

  @Expose()
  consumer_wallet: number;

  @Expose()
  oneso_pay: number;

  @Expose()
  userId: string;

  @Expose()
  shopId: ShopEntity;
}
