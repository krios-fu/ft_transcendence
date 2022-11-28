import { Test, TestingModule } from '@nestjs/testing';
import { AchievementsUserService } from './achievements_user.service';

describe('AchievementsUserService', () => {
  let service: AchievementsUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AchievementsUserService],
    }).compile();

    service = module.get<AchievementsUserService>(AchievementsUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
