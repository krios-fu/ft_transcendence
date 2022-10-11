import { Module } from '@nestjs/common';
import { RoomRolesService } from './room_roles.service';
import { RoomRolesController } from './room_roles.controller';
import { RoomRolesRepository } from './repository/room_roles.repository';
import { RoomRolesEntity } from './entity/room_roles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomModule } from 'src/room/room.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomRolesEntity]),
    RoomModule,
    RolesModule,
  ],
  controllers: [RoomRolesController],
  providers: [
    RoomRolesRepository,
    RoomRolesService,
  ],
  exports: [RoomRolesService]
})
export class RoomRolesModule { }
