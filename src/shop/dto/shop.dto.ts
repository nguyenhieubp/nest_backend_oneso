import { BusinessArenas } from '../business_arenas.enum';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { BaseDto } from 'src/config/baseDto';

export class ShopDto extends BaseDto {
  @Expose()
  @IsNotEmpty()
  shop_name: string;

  @Expose()
  short_description: string;

  @Expose()
  detailed_description: string;

  @Expose()
  @IsNotEmpty()
  managed_shop: string;

  @Expose()
  @IsNotEmpty()
  phone_number: string;

  @Expose()
  @IsNotEmpty()
  email: string;

  @Expose()
  @IsNotEmpty()
  city: string;

  @Expose()
  @IsNotEmpty()
  district: string;

  @Expose()
  @IsNotEmpty()
  specific_address: string;

  @IsNotEmpty()
  @Expose()
  business_arenas: keyof BusinessArenas;

  @Expose()
  referral_code: string;

  @Expose()
  avatar_shop: string;

  @Expose()
  banner_shop: string;
}
