import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { BaseDto } from 'src/config/baseDto';
import { UserEntity } from 'src/user/user.entity/user.entity';

export class AddressUserDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  address_line1: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  address_line2: string;
}
