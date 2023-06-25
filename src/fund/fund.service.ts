import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FundEntity } from './entity/fund.entity';
import { Repository } from 'typeorm';
import { FundDto } from './dto/fund.dto';

@Injectable()
export class FundService {
  constructor(
    @InjectRepository(FundEntity)
    private readonly fundRepository: Repository<FundEntity>,
  ) {}

  async createFund(fund: FundDto): Promise<FundEntity> {
    return await this.fundRepository.save(fund);
  }

  public validateUp(money: number) {
    if (money < 0) {
      return 'Account not enough';
    }
  }

  public validateDown(fund: FundEntity, money: number) {
    if (fund.discount_fund < money) {
      console.log('ooo');
    }
    return undefined;
  }

  async discountFundUp(
    id: string,
    money: number,
  ): Promise<FundEntity | string> {
    const fund = await this.fundRepository.findOneById(id);
    const validationMessage = this.validateUp(money);
    if (validationMessage) {
      return validationMessage;
    }
    fund.discount_fund += money;
    await this.fundRepository.save(fund);
    return await this.fundRepository.findOneById(id);
  }

  async discountFundDown(
    id: string,
    money: number,
  ): Promise<FundEntity | string> {
    const fund = await this.fundRepository.findOneById(id);
    const validationMessage = this.validateDown(fund, money);
    if (validationMessage) {
      return validationMessage;
    }
    fund.discount_fund -= money;
    await this.fundRepository.save(fund);
    return await this.fundRepository.findOneById(id);
  }

  async policyFundUp(id: string, money: number): Promise<FundEntity | string> {
    const fund = await this.fundRepository.findOneById(id);
    const validationMessage = this.validateUp(money);
    if (validationMessage) {
      return validationMessage;
    }
    fund.policy_fund += money;
    await this.fundRepository.save(fund);
    return await this.fundRepository.findOneById(id);
  }

  async policyFundDown(
    id: string,
    money: number,
  ): Promise<FundEntity | string> {
    const fund = await this.fundRepository.findOneById(id);
    const validationMessage = this.validateDown(fund, money);
    if (validationMessage) {
      return validationMessage;
    }
    fund.policy_fund -= money;
    await this.fundRepository.save(fund);
    return await this.fundRepository.findOneById(id);
  }

  async managerFundUp(id: string, money: number): Promise<FundEntity | string> {
    const fund = await this.fundRepository.findOneById(id);
    const validationMessage = this.validateUp(money);
    if (validationMessage) {
      return validationMessage;
    }
    fund.management_fund += money;
    await this.fundRepository.save(fund);
    return await this.fundRepository.findOneById(id);
  }

  async managerFundDown(
    id: string,
    money: number,
  ): Promise<FundEntity | string> {
    const fund = await this.fundRepository.findOneById(id);
    const validationMessage = this.validateDown(fund, money);
    if (validationMessage) {
      return validationMessage;
    }
    fund.management_fund -= money;
    await this.fundRepository.save(fund);
    return await this.fundRepository.findOneById(id);
  }
}
