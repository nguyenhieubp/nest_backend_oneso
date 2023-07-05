import { Module, forwardRef } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopEntity } from './entity/shop.entity';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import * as dotenv from 'dotenv';
import { OTPEntity } from '../otp/otp.entity';
import { OtpModule } from 'src/otp/otp.module';
import { ProductEntity } from 'src/product/entity/product.entity';
import { OrderService } from 'src/order/order.service';
import { OrderModule } from 'src/order/order.module';
import { ProductModule } from 'src/product/product.module';
dotenv.config();

@Module({
  imports: [
    OtpModule,
    OrderModule,
    ProductModule,
    TypeOrmModule.forFeature([ShopEntity, OTPEntity, ProductEntity]),
    MailerModule.forRoot({
      transport: {
        host: process.env.HOST_EMAIL,
        secure: false,
        auth: {
          user: process.env.EMAIL,
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
