import { Injectable } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { VoucherService } from 'src/voucher/voucher.service';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    private readonly voucherService: VoucherService,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async orderByVoucher(order: OrderDto): Promise<any> {
    const { vouchers, ...dataOrder } = order;
    const newOrder = await this.orderRepository.save(dataOrder);
    this.applyVoucher(order.vouchers, newOrder.id);
    return newOrder;
  }

  async applyVoucher(vouchers: string[], orderId: string) {
    vouchers.map((item) => {
      this.voucherService.setUseVoucher(item, orderId);
    });
  }
}
