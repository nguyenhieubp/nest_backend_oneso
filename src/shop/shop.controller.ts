import { ApiBody, ApiCookieAuth } from '@nestjs/swagger/dist';
import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopDto } from './dto/shop.dto';
import { ShopEntity } from './entity/shop.entity';
import { OtpService } from 'src/otp/otp.service';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { OrderService } from 'src/order/order.service';
import { ProductEntity } from 'src/product/entity/product.entity';

@Controller('shop')
@ApiTags('Shop')
export class ShopController {
  constructor(
    private readonly shopService: ShopService,
    private readonly otpService: OtpService,
    private readonly orderService: OrderService,
  ) {}

  @ApiBody({ type: ShopDto })
  @Post()
  registerShop(@Body() shop: ShopDto): Promise<ShopEntity> {
    const shopReal = ShopDto.plainToClass(shop);
    return this.shopService.registerShop(shopReal);
  }

  @Get('verify-shop')
  @ApiCookieAuth('access_token_shop')
  async verifyShop(@Req() req: Request): Promise<ShopEntity> {
    return this.shopService.verifyShop(req);
  }

  @Post('refresh-token')
  @ApiCookieAuth()
  async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<{}> {
    return this.shopService.refreshToken(res, req);
  }

  @Post('/generate-otp')
  async generateOTP(@Body('phoneNumber') phoneNumber: string): Promise<any> {
    const email: string = await this.shopService.findEmailByPhoneNumber(
      phoneNumber,
    );
    const otp = await this.otpService.generateOTP(email, 5); // OTP hết hạn sau 5 phút
    return await this.shopService.sendOTP(email, otp); // Gửi mã OTP qua email
  }

  @Post('/verify-otp')
  async verifyOTP(
    @Res({ passthrough: true }) res: Response,
    @Body('email') email: string,
    @Body('code') code: string,
  ): Promise<any> {
    const isOTPValid = await this.otpService.verifyOTP(email, code);
    if (isOTPValid) {
      return this.shopService.generateToken(email, res);
    } else {
      return { message: 'Invalid OTP' };
    }
  }

  @Patch('update/avatar/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  uploadAvatarShop(
    @Param('id') id: string,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.shopService.uploadAvatarShop(id, res, file);
  }

  @Patch('update/banner/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  uploadBannerShop(
    @Param('id') id: string,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.shopService.uploadBannerShop(id, res, file);
  }

  @Put('update/:id')
  updateShop(
    @Param('id') id: string,
    @Body() dataShopUpdate: any,
  ): Promise<any> {
    return this.shopService.updateShop(id, dataShopUpdate);
  }

  @Delete(':id')
  deleteShop(@Param('id') id: string) {
    return this.shopService.deleteShop(id);
  }

  @Get('business/:arena')
  getShopByBusinessArena(
    @Param('arena') arena: string,
  ): Promise<Array<ShopEntity>> {
    return this.shopService.getShopByBusinessArena(arena);
  }

  @Get('')
  getAllShop(): Promise<Array<ShopEntity>> {
    return this.shopService.getAllShop();
  }

  @Get(':id/order/online')
  getAllOrderOnlineOfShop(@Param('id') id: string) {
    return this.orderService.getAllOrderOnlineOfShop(id);
  }

  @Get(':id/order/online/purchased')
  getAllOrderOnlineOfShopPurchased(@Param('id') id: string) {
    return this.orderService.getAllOrderOnlineOfShopPurchased(id);
  }

  @Get(':id/order/offline')
  getAllOrderOfflineShop(@Param('id') id: string) {
    return this.orderService.getAllOrderOfflineShop(id);
  }

  @Get(':id/order/offline/purchased')
  getAllOrderOfflineShopPurchased(@Param('id') id: string) {
    return this.orderService.getAllOrderOfflineShopPurchased(id);
  }
}
