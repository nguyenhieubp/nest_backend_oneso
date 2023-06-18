import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity/user.entity';
import { GoogleStrategy } from './strategy/google.strategy';
import { JwtModule } from '@nestjs/jwt';
import { RefreshJwtStrategy } from './strategy/refresh_jwt.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guard/roles.guard';
import { AuthController } from './auth.controller';
import { GlobalExceptionFilter } from 'src/config/exceptionFilter';
import { ShopEntity } from 'src/shop/entity/shop.entity';
import { config } from 'dotenv';
config();

@Module({
  controllers: [UserController, AuthController],
  imports: [
    TypeOrmModule.forFeature([UserEntity, ShopEntity]),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  providers: [
    UserService,
    GoogleStrategy,
    RefreshJwtStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
  exports: [UserService],
})
export class UserModule {}
