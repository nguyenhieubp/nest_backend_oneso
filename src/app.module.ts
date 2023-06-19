import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { UploadModule } from './uploadfile/upload.module';
import { ShopModule } from './shop/shop.module';
import { OtpModule } from './otp/otp.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    UploadModule,
    ShopModule,
    OtpModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
