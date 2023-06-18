import { MailerService } from '@nestjs-modules/mailer/dist';
import { Body, Controller, Post } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopDto } from './dto/shop.dto';
import { ShopEntity } from './entity/shop.entity';
import { OtpService } from 'src/otp/otp.service';

@Controller('shop')
export class ShopController {
  constructor(
    private readonly shopService: ShopService,
    private readonly otpService: OtpService,
  ) {}

  @Post()
  registerShop(@Body() shop: ShopDto): Promise<ShopEntity> {
    const shopReal = ShopDto.plainToClass(shop);
    return this.shopService.registerShop(shopReal);
  }

  @Post('/generate-otp')
  async generateOTP(@Body('phoneNumber') phoneNumber: string): Promise<any> {
    const email: string = await this.shopService.findEmailByPhoneNumber(
      phoneNumber,
    );
    const otp = await this.otpService.generateOTP(email, 5); // OTP hết hạn sau 5 phút
    await this.shopService.sendOTP(email, otp); // Gửi mã OTP qua email
  }

  @Post('/verify-otp')
  async verifyOTP(
    @Body('email') email: string,
    @Body('code') code: string,
  ): Promise<any> {
    const isOTPValid = await this.otpService.verifyOTP(email, code);
    if (isOTPValid) {
      return { message: 'OTP verified successfully' };
    } else {
      return { message: 'Invalid OTP' };
    }
  }
}
