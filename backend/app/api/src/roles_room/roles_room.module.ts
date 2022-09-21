import { Module } from '@nestjs/common';
import { RolesRoomService } from './roles_room.service';
import { RolesRoomController } from './roles_room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesRoomEntity } from './entities/roles_room.entity';
import { RoomModule } from 'src/room/room.module';
import { RolesModule } from 'src/roles/roles.module';
import { RolesRoomMapper } from './roles_room.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([RolesRoomEntity]),
    RoomModule,
    RolesModule,
  ],
  providers: [
    RolesRoomService,
    RolesRoomMapper,
  ],
  controllers: [RolesRoomController],
  exports: [],
})
export class RolesRoomModule { }
