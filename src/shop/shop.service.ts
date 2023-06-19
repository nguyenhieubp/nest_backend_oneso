import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopEntity } from './entity/shop.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { ShopDto } from './dto/shop.dto';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(ShopEntity)
    private readonly shopRepository: Repository<ShopEntity>,
    private readonly mailService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  async registerShop(dataShop: ShopDto): Promise<ShopEntity> {
    return await this.shopRepository.save(dataShop);
  }

  async findEmailByPhoneNumber(phoneNumber: string) {
    const result = await this.shopRepository.findOne({
      select: ['email'],
      where: { phone_number: phoneNumber },
    });

    return result.email;
  }

  //SEND OTP
  async sendOTP(toEmail: string, otp: string): Promise<any> {
    const response = await this.mailService.sendMail({
      to: toEmail,
      from: 'nguyenhieu11ka@gmail.com',
      subject: 'OTP',
      text: 'Mã OTP: ' + otp,
    });
    return response;
  }

  async generateToken(email: string, res: Response) {
    const access_token_shop = await this.jwtService.signAsync(
      { email: email },
      { expiresIn: '2m' },
    );
    const refresh_token_shop = await this.jwtService.signAsync(
      { email: email },
      { expiresIn: '365d' },
    );
    res.cookie('access_token_shop', `Bearer ${access_token_shop}`);
    res.cookie('refresh_token_shop', `Bearer ${refresh_token_shop}`);
    return {
      message: 'success',
      access_token_shop: access_token_shop,
      refresh_token_shop: access_token_shop,
    };
  }

  async refreshToken(res: Response, req: Request): Promise<{}> {
    const tokenRefreshBearer = req.cookies['refresh_token_shop'];
    const token = tokenRefreshBearer.replace('Bearer ', '');
    const emailShop = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });
    const access_token_shop = await this.jwtService.signAsync(
      { email: emailShop.email },
      { expiresIn: '2d' },
    );
    res.cookie('access_token_shop', `Bearer ${access_token_shop}`);
    return { access_token_shop: access_token_shop };
  }

  async verifyShop(req: Request): Promise<ShopEntity> {
    const cookieEmail = req.cookies['access_token_shop'];
    const token = cookieEmail.replace('Bearer ', '');
    const shop = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });
    return this.shopRepository.findOneBy({ email: shop.email });
  }

  async uploadAvatarShop(id: string, res: Response, file: Express.Multer.File) {
    const imagePath = path.join(__dirname, '../../uploads', file.filename);
    await this.shopRepository.update(id, { avatar_shop: imagePath });
    res.sendFile(imagePath);
  }

  async uploadBannerShop(id: string, res: Response, file: Express.Multer.File) {
    const imagePath = path.join(__dirname, '../../uploads', file.filename);
    await this.shopRepository.update(id, { banner_shop: imagePath });
    res.sendFile(imagePath);
  }

  async updateShop(id: string, dataShopUpdate: any): Promise<ShopEntity> {
    await this.shopRepository.update(id, dataShopUpdate);
    return this.shopRepository.findOneById(id);
  }

  async deleteShop(id: string): Promise<string> {
    await this.shopRepository.delete(id);
    return 'DELETE SUCCESS';
  }
}
