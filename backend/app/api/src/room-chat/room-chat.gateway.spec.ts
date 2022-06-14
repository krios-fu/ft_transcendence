import { Test, TestingModule } from '@nestjs/testing';
import { RoomChatGateway } from './room-chat.gateway';

describe('RoomChatGateway', () => {
  let gateway: RoomChatGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomChatGateway],
    }).compile();

    gateway = module.get<RoomChatGateway>(RoomChatGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
