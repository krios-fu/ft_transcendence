import { Module } from '@nestjs/common';
import { UserRoomService } from './user_room.service';
import { UserRoomController } from './user_room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoomEntity } from './entity/user_room.entity';
import { UserRoomRepository } from './repository/user_room.repository';
import { UserModule } from '../user/user.module';
import { RoomModule } from '../room/room.module';
import { RoomRolesModule } from '../room_roles/room_roles.module';
import { BanModule } from '../ban/ban.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRoomEntity]),
    UserModule,
    RoomModule,
    RoomRolesModule,
    BanModule,
  ],
  controllers: [UserRoomController],
  providers: [
    UserRoomService,
    UserRoomRepository,
  ],
  exports: [UserRoomService]
})
export class UserRoomModule { }
