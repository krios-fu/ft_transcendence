import { Module } from '@nestjs/common';
import { RoomChatGateway } from './room-chat.gateway';

@Module({
  providers: [RoomChatGateway]
})
export class RoomChatModule {}
