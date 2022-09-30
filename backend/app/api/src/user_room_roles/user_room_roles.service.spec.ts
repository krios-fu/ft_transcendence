import { Test, TestingModule } from '@nestjs/testing';
import { RolesRoomService } from './roles_room.service';

describe('RolesRoomService', () => {
  let service: RolesRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesRoomService],
    }).compile();

    service = module.get<RolesRoomService>(RolesRoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
