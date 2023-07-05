import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller('')
@ApiTags('Start')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() request: Request): string {
    console.log(request.cookies);
    return this.appService.getHello();
  }
}
