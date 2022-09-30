import { Module } from '@nestjs/common';
import { RoomRolesService } from './room_roles.service';
import { RoomRolesController } from './room_roles.controller';
import { RoomRolesRepository } from './repository/room_roles.repository';
import { RoomRolesMapper } from './room_roles.mapper';

@Module({
  imports: [],
  controllers: [RoomRolesController],
  providers: [
    RoomRolesService,
    RoomRolesMapper,
    RoomRolesRepository,
  ],
  exports: []
})
export class RoomRolesModule { }
