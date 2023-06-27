import { Test, TestingModule } from '@nestjs/testing';
import { UserRightService } from './user-right.service';

describe('UserRightService', () => {
  let service: UserRightService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRightService],
    }).compile();

    service = module.get<UserRightService>(UserRightService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
