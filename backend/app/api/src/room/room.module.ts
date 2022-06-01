import { Module } from '@nestjs/common';
import { RoomService } from './room/room.service';
import { RoomController } from './room/room.controller';

@Module({
  providers: [RoomService],
  controllers: [RoomController]
})
export class RoomModule {}
