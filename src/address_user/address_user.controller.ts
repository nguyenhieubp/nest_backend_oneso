import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Get,
  Put,
} from '@nestjs/common';
import { AddressUserService } from './address_user.service';
import { AddressUserDto } from './dto/address_user.dto';
import { AddressUserEntity } from './entity/address_user.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('address')
@ApiTags('Address')
export class AddressUserController {
  constructor(private readonly addressUserService: AddressUserService) {}

  @Post()
  createAddress(
    @Body() addressData: AddressUserDto,
  ): Promise<AddressUserEntity> {
    const address: AddressUserDto = AddressUserDto.plainToClass(addressData);
    return this.addressUserService.createAddress(address);
  }

  @Get(':id')
  getAddress(@Param('id') id: string): Promise<AddressUserEntity> {
    return this.addressUserService.getAddress(id);
  }

  @Put(':id')
  updateAddress(@Param('id') id: string, @Body() dataUpdate: any): Promise<{}> {
    return this.addressUserService.updateAddress(id, dataUpdate);
  }

  @Delete(':id')
  deleteAddress(@Param('id') id: string): Promise<{}> {
    return this.addressUserService.deleteAddress(id);
  }
}
