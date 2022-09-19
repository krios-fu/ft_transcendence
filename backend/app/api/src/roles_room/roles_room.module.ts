import { Module } from '@nestjs/common';
import { RolesRoomService } from './roles_room.service';
import { RolesRoomController } from './roles_room.controller';

@Module({
  providers: [RolesRoomService],
  controllers: [RolesRoomController]
})
export class RolesRoomModule {}
