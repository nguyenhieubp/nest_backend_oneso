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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger/dist';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('findUser')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtGuard)
  findUser(@Req() req): Promise<UserEntity> {
    return this.userService.findUser(req.user.id);
  }

  @Get('findById/:id')
  findUserById(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.findUserById(id);
  }

  @Patch('update/phoneNumber')
  @ApiBearerAuth('JWT-auth')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phoneNumber: {
          type: 'string',
          description: 'Phone Number',
        },
      },
    },
  })
  @UseGuards(JwtGuard)
  updatePhoneNumber(
    @Req() req,
    @Body('phoneNumber') phoneNumber: string,
  ): Promise<UserEntity> {
    return this.userService.updatePhoneNumber(req.user.id, phoneNumber);
  }

  @Patch('referralCode')
  @ApiBearerAuth('JWT-auth')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        referralCode: {
          type: 'string',
          description: 'referralCode',
        },
      },
    },
  })
  @UseGuards(JwtGuard)
  referralCode(
    @Req() req,
    @Body('referralCode') referralCode: string,
  ): Promise<{ referral_code: string }> {
    return this.userService.referralCode(req.user.id, referralCode);
  }

  @Patch('update/avatar')
  @ApiBearerAuth('JWT-auth')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          description: 'avatar',
        },
      },
    },
  })
  @UseGuards(JwtGuard)
  updateAvatar(
    @Req() req,
    @Body('avatar') avatar: string,
  ): Promise<{ avatar: string }> {
    return this.userService.updateAvatar(req.user.id, avatar);
  }

  @Put('update')
  @ApiBearerAuth('JWT-auth')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'any',
          description: 'user',
        },
      },
    },
  })
  @UseGuards(JwtGuard)
  async updateUser(
    @Req() req,
    @Body() user: any,
  ): Promise<UserEntity | { error: any }> {
    return await this.userService.updateUser(req.user.id, user);
  }

  @Patch('address')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        address: {
          type: 'string',
          description: 'address',
        },
      },
    },
  })
  updateAddress(
    @Req() req,
    @Body('address') address: string,
  ): Promise<UserEntity | { error: any }> {
    return this.userService.updateAddress(req.user.id, address);
  }
}
