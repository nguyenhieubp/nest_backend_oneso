import { Injectable } from '@nestjs/common';
import { OTPEntity } from './otp.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OTPEntity)
    private readonly otpRepository: Repository<OTPEntity>,
  ) {}

  async generateOTP(email: string, expiresInMinutes: number): Promise<string> {
    const code = Math.random().toString().slice(2, 8); // Tạo mã OTP ngẫu nhiên
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes); // Thời gian hết hạn của OTP

    const otp = new OTPEntity();
    otp.email = email;
    otp.code = code;
    otp.expiresAt = expiresAt;

    await this.otpRepository.save(otp); // Lưu OTP vào cơ sở dữ liệu
    return code;
  }

  //*
  //*
  //*
  //*
  async verifyOTP(email: string, code: string): Promise<boolean> {
    const otp = await this.otpRepository.findOneBy({ email, code });

    if (!otp) {
      return false; // Mã OTP không tồn tại trong cơ sở dữ liệu
    }

    if (otp.expiresAt < new Date()) {
      return false; // Mã OTP đã hết hạn
    }

    // Xóa OTP khỏi cơ sở dữ liệu sau khi xác thực thành công
    await this.otpRepository.delete(otp.id);

    return true;
  }
}
