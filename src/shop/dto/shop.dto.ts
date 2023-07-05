import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { BusinessArenas } from '../business_arenas.enum';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { BaseDto } from 'src/config/baseDto';

export class ShopDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  shop_name: string;

  @ApiProperty()
  @Expose()
  short_description: string;

  @ApiProperty()
  @Expose()
  detailed_description: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  managed_shop: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  district: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  specific_address: string;

  @IsNotEmpty()
  @ApiProperty()
  @Expose()
  business_arena: keyof BusinessArenas;

  @ApiProperty()
  @Expose()
  referral_code: string;

  @ApiProperty()
  @Expose()
  avatar_shop: string;

  @ApiProperty()
  @Expose()
  banner_shop: string;
}
