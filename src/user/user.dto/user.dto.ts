import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';
import { BaseDto } from '../../config/baseDto';
import { Role } from '../role.enum';
import { AddressUserEntity } from 'src/address_user/entity/address_user.entity';
import { ApiProduces, ApiProperty } from '@nestjs/swagger/dist/decorators';

export class UserDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  name: string;

  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  avatar: string;

  @ApiProperty()
  @Expose()
  phone_number: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  user_code: string;

  @ApiProperty()
  @Expose()
  referral_code: string;

  @ApiProperty()
  @Expose()
  roles: Role[];

  @ApiProperty()
  @Expose()
  refresh_token: string;

  @ApiProperty()
  @Expose()
  @IsUUID()
  address: AddressUserEntity;
}
