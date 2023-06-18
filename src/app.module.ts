import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { UploadModule } from './uploadfile/upload.module';
import { ShopModule } from './shop/shop.module';
import { CookieParserMiddleware } from 'cookie-parser';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [DatabaseModule, UserModule, UploadModule, ShopModule, OtpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CookieParserMiddleware).forRoutes('*');
  }
}
