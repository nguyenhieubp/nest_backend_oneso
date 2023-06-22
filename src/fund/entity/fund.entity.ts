import { BaseEntity } from 'src/config/baseEntity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'fund' })
export class FundEntity extends BaseEntity {
  @Column({ default: 0 })
  discount_fund: number;

  @Column({ default: 0 })
  policy_fund: number;

  @Column({ default: 0 })
  management_fund: number;
}
