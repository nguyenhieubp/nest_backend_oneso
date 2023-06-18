import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as env from 'dotenv';
env.config();

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async validationUser({
    email,
    name,
    avatar,
  }: {
    email: string;
    name: string;
    avatar: string;
  }) {
    const user = await this.userRepository.findOneBy({ email: email });
    if (!user) {
      let digits = '1234567890';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += digits[Math.floor(Math.random() * 10)];
      }
      return await this.userRepository.save({
        user_code: code,
        avatar: avatar,
        email: email,
        name: name,
      });
    }
    return user;
  }

  async googleLogin(req: any) {
    if (!req.user) {
      return 'No user from google';
    }
    const accessToken = await this.jwtService.signAsync(
      { id: req.user.id },
      { expiresIn: '2m' },
    );
    const reFreshToken = await this.jwtService.signAsync(
      { id: req.user.id },
      { expiresIn: '365d' },
    );

    await this.userRepository.update(req.user.id, {
      refresh_token: reFreshToken,
    });

    return {
      message: 'User information from google',
      accessToken,
      reFreshToken,
    };
  }

  async refreshToken(user: any): Promise<{ access_token: string }> {
    const payload = { id: user.id };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '2m' }),
    };
  }

  async registerAdmin(id: string): Promise<UserEntity> {
    await this.userRepository.update(id, { roles: 'admin' });
    return this.findUserById(id);
  }

  async findUser(id: string): Promise<UserEntity> {
    return await this.userRepository.findOneById(id);
  }

  async findUserById(id: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      select: [
        'email',
        'name',
        'avatar',
        'roles',
        'phone_number',
        'referral_code',
        'user_code',
        'create_at',
        'update_at',
      ],
      where: { id: id },
    });
  }

  async updatePhoneNumber(
    id: string,
    phoneNumber: string,
  ): Promise<UserEntity> {
    await this.userRepository.update(id, { phone_number: phoneNumber });
    return this.findUserById(id);
  }

  async referralCode(
    id: string,
    referralCode: string,
  ): Promise<{ referral_code: string }> {
    await this.userRepository.update(id, { referral_code: referralCode });
    return this.userRepository.findOne({
      select: ['referral_code'],
      where: { id: id },
    });
  }

  async updateAvatar(id: string, avatar: string): Promise<{ avatar: string }> {
    await this.userRepository.update(id, { avatar: avatar });
    return this.userRepository.findOne({
      select: ['avatar'],
      where: { id: id },
    });
  }

  async updateUser(id: string, user: any): Promise<UserEntity> {
    await this.userRepository.update(id, user);
    return this.userRepository.findOneById(id);
  }
}
