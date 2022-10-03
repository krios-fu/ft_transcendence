import { Module } from '@nestjs/common';
import { RoomRolesService } from './room_roles.service';
import { RoomRolesController } from './room_roles.controller';
import { RoomRolesRepository } from './repository/room_roles.repository';

@Module({
  imports: [],
  controllers: [RoomRolesController],
  providers: [
    RoomRolesService,
    RoomRolesRepository,
  ],
  exports: []
})
export class RoomRolesModule { }
