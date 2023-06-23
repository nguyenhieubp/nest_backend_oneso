import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { UploadModule } from './uploadfile/upload.module';
import { ShopModule } from './shop/shop.module';
import { OtpModule } from './otp/otp.module';
import { ProductModule } from './product/product.module';
import { WalletModule } from './wallet/wallet.module';
import { FundModule } from './fund/fund.module';
import { AddressUserModule } from './address_user/address_user.module';
import { OrderItemModule } from './order_item/order_item.module';
import { OrderModule } from './order/order.module';
import { CartModule } from './cart/cart.module';
import { CartItemModule } from './cart_item/cart_item.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    UploadModule,
    ShopModule,
    OtpModule,
    ProductModule,
    WalletModule,
    FundModule,
    AddressUserModule,
    OrderItemModule,
    OrderModule,
    CartModule,
    CartItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
