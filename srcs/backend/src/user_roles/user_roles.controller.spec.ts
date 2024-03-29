import { Test, TestingModule } from '@nestjs/testing';
import { RolesUserController } from './user_roles.controller';

describe('RolesUserController', () => {
  let controller: RolesUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesUserController],
    }).compile();

    controller = module.get<RolesUserController>(RolesUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
