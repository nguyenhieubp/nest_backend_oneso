import {
  Req,
  Controller,
  Get,
  UseGuards,
  Patch,
  Param,
  Body,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity/user.entity';
import { JwtGuard } from './guard/jwt.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('register/admin')
  @UseGuards(JwtGuard)
  registerAdmin(@Req() req): Promise<UserEntity> {
    return this.userService.registerAdmin(req.user.id);
  }

  @Get('findUser')
  @UseGuards(JwtGuard)
  findUser(@Req() req): Promise<UserEntity> {
    return this.userService.findUser(req.user.id);
  }

  @Get('findById/:id')
  findUserById(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.findUserById(id);
  }

  @Patch('update/phoneNumber')
  @UseGuards(JwtGuard)
  updatePhoneNumber(
    @Req() req,
    @Body('phoneNumber') phoneNumber: string,
  ): Promise<UserEntity> {
    return this.userService.updatePhoneNumber(req.user.id, phoneNumber);
  }

  @Patch('referralCode')
  @UseGuards(JwtGuard)
  referralCode(
    @Req() req,
    @Body('referralCode') referralCode: string,
  ): Promise<{ referral_code: string }> {
    return this.userService.referralCode(req.user.id, referralCode);
  }

  @Patch('update/avatar')
  @UseGuards(JwtGuard)
  updateAvatar(
    @Req() req,
    @Body('avatar') avatar: string,
  ): Promise<{ avatar: string }> {
    return this.userService.updateAvatar(req.user.id, avatar);
  }

  @Put('update')
  @UseGuards(JwtGuard)
  async updateUser(
    @Req() req,
    @Body() user: any,
  ): Promise<UserEntity | { error: any }> {
    return await this.userService.updateUser(req.user.id, user);
  }

  @Patch('address')
  @UseGuards(JwtGuard)
  updateAddress(
    @Req() req,
    @Body('address') address: string,
  ): Promise<UserEntity | { error: any }> {
    return this.userService.updateAddress(req.user.id, address);
  }
}
