import { Module } from '@nestjs/common';
import { RolesRoomService } from './roles_room.service';
import { RolesRoomController } from './roles_room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesRoomEntity } from './entity/roles_room.entity';
import { RolesRoomMapper } from './roles_room.mapper';
import { UsersRoomModule } from 'src/users_room/users_room.module';
import { RolesModule } from 'src/roles/roles.module';
import { RolesRoomRepository } from './repository/roles_room.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([RolesRoomEntity]),
    UsersRoomModule,
    RolesModule,
  ],
  providers: [
    RolesRoomService,
    RolesRoomRepository,
    RolesRoomMapper,
  ],
  controllers: [RolesRoomController],
  exports: [RolesRoomService],
})
export class RolesRoomModule { }
