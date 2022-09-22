import { Module } from '@nestjs/common';
import { UsersRoomService } from './users_room.service';
import { UsersRoomController } from './users_room.controller';

@Module({
  controllers: [UsersRoomController],
  providers: [UsersRoomService]
})
export class UsersRoomModule {}
