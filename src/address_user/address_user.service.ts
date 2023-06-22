import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressUserEntity } from './entity/address_user.entity';
import { Repository } from 'typeorm';
import { AddressUserDto } from './dto/address_user.dto';

@Injectable()
export class AddressUserService {
  constructor(
    @InjectRepository(AddressUserEntity)
    private readonly addressRepository: Repository<AddressUserEntity>,
  ) {}

  async createAddress(address: AddressUserDto): Promise<AddressUserEntity> {
    return this.addressRepository.save(address);
  }

  async deleteAddress(id: string): Promise<{}> {
    return await this.addressRepository.delete(id);
  }

  async getAddress(id: string): Promise<AddressUserEntity> {
    return await this.addressRepository.findOneById(id);
  }

  async updateAddress(id: string, dataUpdate: any): Promise<AddressUserEntity> {
    await this.addressRepository.update(id, dataUpdate);
    return this.addressRepository.findOneById(id);
  }
}
