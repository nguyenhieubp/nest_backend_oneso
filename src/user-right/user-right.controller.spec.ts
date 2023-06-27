import { Test, TestingModule } from '@nestjs/testing';
import { UserRightController } from './user-right.controller';
import { UserRightService } from './user-right.service';

describe('UserRightController', () => {
  let controller: UserRightController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRightController],
      providers: [UserRightService],
    }).compile();
    controller = module.get<UserRightController>(UserRightController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
