import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from './../user/guard/jwt.guard';
import { Controller, Put, Body, Logger, Req, UseGuards } from '@nestjs/common';
import { UserRightService } from './user-right.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('user-right')
@ApiTags('User-Right')
export class UserRightController {
  constructor(private readonly userRightService: UserRightService) {}

  @Cron('0 0 1 * * *')
  @UseGuards(JwtGuard)
  handleCron(@Req() req) {
    return this.userRightService.consumerWalletSharingIncome(req.user.id);
  }
}
