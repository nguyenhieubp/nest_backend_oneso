import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { BaseDto } from 'src/config/baseDto';
import { UserEntity } from 'src/user/user.entity/user.entity';

export class CartDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  userId: UserEntity;
}
