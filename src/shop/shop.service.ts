import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopEntity } from './entity/shop.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { ShopDto } from './dto/shop.dto';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(ShopEntity)
    private readonly shopRepository: Repository<ShopEntity>,
    private readonly mailService: MailerService,
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
}
