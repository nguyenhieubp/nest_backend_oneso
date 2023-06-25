import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VoucherEntity } from './entity/voucher.entity';
import { Repository } from 'typeorm';
import { VoucherDto } from './dto/voucher.dto';

@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(VoucherEntity)
    private readonly voucherRepository: Repository<VoucherEntity>,
  ) {}

  async createVoucher(voucher: VoucherDto): Promise<VoucherEntity> {
    const expires = new Date();
    expires.setDate(expires.getDate() + voucher.expiresInDay);
    const newVoucher = await this.voucherRepository.save({
      ...voucher,
      expiresAt: expires,
    });
    return newVoucher;
  }

  async getVoucherByUser(id: string): Promise<Array<VoucherEntity>> {
    const vouches = await this.voucherRepository
      .createQueryBuilder('vouchers')
      .where('vouchers.user =:userId ', { userId: id })
      .getMany();

    const vouchesFilterExpire = await Promise.all(
      vouches.map(async (voucher) => {
        if (voucher.expiresAt < new Date()) {
          this.voucherRepository.delete(voucher.id);
        }
        return voucher;
      }),
    );

    return vouchesFilterExpire;
  }

  async setUseVoucher(id: string, idOrder: string): Promise<VoucherEntity> {
    const voucher = await this.voucherRepository.findOneById(id);
    voucher.isUse = true;
    voucher.orderId = idOrder;
    await this.voucherRepository.update(id, voucher);
    return await this.voucherRepository.findOneById(id);
  }

  async deleteVoucher(id: string): Promise<string> {
    await this.voucherRepository.delete(id);
    return 'DELETE SUCCESS';
  }
}
