import { BaseEntity } from 'src/config/baseEntity';
import { OrderEntity } from 'src/order/entity/order.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity({ name: 'order_item' })
export class OrderItemEntity extends BaseEntity {
  @Column('uuid')
  productId: ProductEntity;

  @OneToOne(() => ProductEntity)
  @JoinColumn()
  product: ProductEntity;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  optionBuy: string;

  @Column('uuid')
  orderId: OrderEntity;

  @ManyToOne(() => OrderEntity, (order) => order.orderItems)
  order: OrderEntity;
}
