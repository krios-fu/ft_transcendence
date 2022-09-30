import { Test, TestingModule } from '@nestjs/testing';
import { UsersRoomController } from './user_room.controller';
import { UsersRoomService } from './user_room.service';

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
