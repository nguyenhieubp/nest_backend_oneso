import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopEntity } from './entity/shop.entity';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import * as dotenv from 'dotenv';
import { OTPEntity } from '../otp/otp.entity';
import { OtpModule } from 'src/otp/otp.module';
dotenv.config();

@Module({
  imports: [
    OtpModule,
    TypeOrmModule.forFeature([ShopEntity, OTPEntity]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        secure: false,
        auth: {
          user: 'nguyenhieu11ka@gmail.com',
          pass: process.env.PASSWORD_MAIL,
        },
      },
    }),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
