import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity/user.entity';
import * as env from 'dotenv';
import * as process from 'process';
import { ShopEntity } from 'src/shop/entity/shop.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { OTPEntity } from 'src/otp/otp.entity';
env.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: Number(process.env.PORT),
      username: 'postgres',
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      entities: [UserEntity, ShopEntity, ProductEntity, OTPEntity],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
