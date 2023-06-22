import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';
import { BaseDto } from '../../config/baseDto';
import { Role } from '../role.enum';
import { AddressUserEntity } from 'src/address_user/entity/address_user.entity';

export class UserDto extends BaseDto {
  @Expose()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Expose()
  @IsNotEmpty()
  avatar: string;

  @Expose()
  phone_number: number;

  @Expose()
  @IsNotEmpty()
  user_code: string;

  @Expose()
  referral_code: string;

  @Expose()
  roles: Role[];

  @Expose()
  refresh_token: string;

  @Expose()
  @IsUUID()
  address: AddressUserEntity;
}
