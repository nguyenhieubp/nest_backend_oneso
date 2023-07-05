import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RefreshJwtGuard } from './guard/refresh_jwt.guard';
import { Controller, Get, UseGuards, Req, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { GoogleAuthGuard } from './guard/google.guard';

@Controller('')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req) {
    return this.userService.googleLogin(req);
  }

  @Post('refreshToken')
  @UseGuards(RefreshJwtGuard)
  @ApiBearerAuth('JWT-auth')
  refreshToken(@Req() req): Promise<{ access_token: string }> {
    return this.userService.refreshToken(req.user);
  }
}
