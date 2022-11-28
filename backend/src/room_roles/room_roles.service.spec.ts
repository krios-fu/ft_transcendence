import { Test, TestingModule } from '@nestjs/testing';
import { RoomRolesService } from './room_roles.service';

describe('RoomRolesService', () => {
  let service: RoomRolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomRolesService],
    }).compile();

    service = module.get<RoomRolesService>(RoomRolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
