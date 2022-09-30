import { Test, TestingModule } from '@nestjs/testing';
import { UserRoomRolesController } from './user_room_roles.controller';

describe('UserRoomRolesController', () => {
  let controller: UserRoomRolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRoomRolesController],
    }).compile();

    controller = module.get<UserRoomRolesController>(UserRoomRolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
