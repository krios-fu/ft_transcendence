import { Module } from '@nestjs/common';
import { RoomRolesService } from './room_roles.service';
import { RoomRolesController } from './room_roles.controller';

@Module({
  controllers: [RoomRolesController],
  providers: [RoomRolesService]
})
export class RoomRolesModule {}
