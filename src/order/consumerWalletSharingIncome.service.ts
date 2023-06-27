import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConsumerWalletSharingIncome {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUserReceiveMoney(id: string) {
    const user = await this.userRepository.findOneById(id);
    //GET ALL USER USE REFERRAL CODE
    const friends = await this.userRepository.findBy({
      referral_code: user.referral_code,
    });

    console.log(friends);
  }

  async getTotalMoneyFriendInMoth() {}
}
