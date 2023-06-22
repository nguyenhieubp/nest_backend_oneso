import { Expose } from 'class-transformer';
import { BaseDto } from 'src/config/baseDto';
import { Column } from 'typeorm';

export class FundDto extends BaseDto {
  @Expose()
  discount_fund: number;

  @Expose()
  policy_fund: number;

  @Column()
  management_fund: number;
}
