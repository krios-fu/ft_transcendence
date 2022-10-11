import { Module } from '@nestjs/common';
import { UserRoomService } from './user_room.service';
import { UserRoomController } from './user_room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoomEntity } from './entity/user_room.entity';
import { UserRoomRepository } from './repository/user_room.repository';
import { UserModule } from 'src/user/user.module';
import { RoomModule } from 'src/room/room.module';
import { RoomRolesService } from 'src/room_roles/room_roles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRoomEntity]),
    UserModule,
    RoomModule,
    RoomRolesService,
  ],
  controllers: [UserRoomController],
  providers: [
    UserRoomService,
    UserRoomRepository,
  ],
  exports: [UserRoomService]
})
export class UserRoomModule { }
