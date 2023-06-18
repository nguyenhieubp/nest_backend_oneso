import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OTPEntity } from './otp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OTPEntity])],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
