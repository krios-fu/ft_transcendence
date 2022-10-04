import { Module } from '@nestjs/common';
import { RoomRolesService } from './room_roles.service';
import { RoomRolesController } from './room_roles.controller';
import { RoomRolesRepository } from './repository/room_roles.repository';
import { RoomRolesEntity } from './entity/room_roles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomRolesEntity]),
  ],
  controllers: [RoomRolesController],
  providers: [
    RoomRolesRepository,
    RoomRolesService,
  ],
  exports: []
})
export class RoomRolesModule { }
