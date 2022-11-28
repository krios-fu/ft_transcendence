import { Test, TestingModule } from '@nestjs/testing';
import { RoomRolesController } from './room_roles.controller';
import { RoomRolesService } from './room_roles.service';

describe('RoomRolesController', () => {
  let controller: RoomRolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomRolesController],
      providers: [RoomRolesService],
    }).compile();

    controller = module.get<RoomRolesController>(RoomRolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
