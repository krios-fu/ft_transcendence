import { Test, TestingModule } from '@nestjs/testing';
import { AchievementsUserController } from './achievements_user.controller';

describe('AchievementsUserController', () => {
  let controller: AchievementsUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AchievementsUserController],
    }).compile();

    controller = module.get<AchievementsUserController>(AchievementsUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
