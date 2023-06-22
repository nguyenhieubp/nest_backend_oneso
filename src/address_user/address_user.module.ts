import { Module } from '@nestjs/common';
import { AddressUserService } from './address_user.service';
import { AddressUserController } from './address_user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressUserEntity } from './entity/address_user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AddressUserEntity])],
  controllers: [AddressUserController],
  providers: [AddressUserService],
})
export class AddressUserModule {}
