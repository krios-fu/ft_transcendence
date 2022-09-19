import { Test, TestingModule } from '@nestjs/testing';
import { RolesRoomController } from './roles_room.controller';

describe('RolesRoomController', () => {
  let controller: RolesRoomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesRoomController],
    }).compile();

    controller = module.get<RolesRoomController>(RolesRoomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
