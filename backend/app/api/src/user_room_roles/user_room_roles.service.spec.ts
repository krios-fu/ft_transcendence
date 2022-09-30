import { Test, TestingModule } from '@nestjs/testing';
import { UserRoomRolesService } from './user_room_roles.service';

describe('UserRoomRolesService', () => {
  let service: UserRoomRolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRoomRolesService],
    }).compile();

    service = module.get<UserRoomRolesService>(UserRoomRolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
