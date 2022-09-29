import { Module } from '@nestjs/common';
import { UsersRoomService } from './users_room.service';
import { UsersRoomController } from './users_room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRoomEntity } from './entity/users_room.entity';
import { UsersRoomRepository } from './repository/users_room.repository';
import { UsersRoomMapper } from './users_room.mapper';
import { UserModule } from 'src/user/user.module';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersRoomEntity]),
    UserModule,
    RoomModule,
  ],
  controllers: [UsersRoomController],
  providers: [
    UsersRoomService,
    UsersRoomRepository,
    UsersRoomMapper,
  ],
  exports: [UsersRoomService]
})
export class UsersRoomModule { }
