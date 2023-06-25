import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherDto } from './dto/voucher.dto';
import { VoucherEntity } from './entity/voucher.entity';

@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post()
  createVoucher(@Body() dataVoucher: VoucherDto): Promise<VoucherEntity> {
    const voucher = VoucherDto.plainToClass(dataVoucher);
    return this.voucherService.createVoucher(voucher);
  }

  @Get('user/:id')
  getVoucherByUser(@Param('id') id: string): Promise<Array<VoucherEntity>> {
    return this.voucherService.getVoucherByUser(id);
  }

  @Delete(':id')
  deleteVoucher(@Param('id') id: string): Promise<string> {
    return this.voucherService.deleteVoucher(id);
  }
}
