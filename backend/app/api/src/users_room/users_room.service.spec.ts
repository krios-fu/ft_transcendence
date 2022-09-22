import { Test, TestingModule } from '@nestjs/testing';
import { UsersRoomService } from './users_room.service';

describe('UsersRoomService', () => {
  let service: UsersRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersRoomService],
    }).compile();

    service = module.get<UsersRoomService>(UsersRoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
