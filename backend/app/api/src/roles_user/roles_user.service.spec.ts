import { Test, TestingModule } from '@nestjs/testing';
import { RolesUserService } from './roles_user.service';

describe('RolesUserService', () => {
  let service: RolesUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesUserService],
    }).compile();

    service = module.get<RolesUserService>(RolesUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
