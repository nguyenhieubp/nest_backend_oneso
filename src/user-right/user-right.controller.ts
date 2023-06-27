import { Controller, Put, Body } from '@nestjs/common';
import { UserRightService } from './user-right.service';

@Controller('user-right')
export class UserRightController {
  constructor(private readonly userRightService: UserRightService) {}

  @Put('')
  consumerWalletSharingIncome(@Body('id') id: string) {
    return this.userRightService.consumerWalletSharingIncome(id);
  }
}
