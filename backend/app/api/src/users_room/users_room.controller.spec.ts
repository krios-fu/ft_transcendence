import { Test, TestingModule } from '@nestjs/testing';
import { UsersRoomController } from './users_room.controller';
import { UsersRoomService } from './users_room.service';

describe('UsersRoomController', () => {
  let controller: UsersRoomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersRoomController],
      providers: [UsersRoomService],
    }).compile();

    controller = module.get<UsersRoomController>(UsersRoomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
