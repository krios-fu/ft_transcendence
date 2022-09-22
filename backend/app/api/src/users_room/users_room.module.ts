import { Module } from '@nestjs/common';
import { UsersRoomService } from './users_room.service';
import { UsersRoomController } from './users_room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRoomEntity } from './entities/users_room.entity';
import { UsersRoomRepository } from './repositories/users_room.repository';
import { UsersRoomMapper } from './users_room.mapper';
import { UserService } from 'src/user/user.service';
import { RoomService } from 'src/room/room.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersRoomEntity]),
    UserService,
    RoomService,
  ],
  controllers: [UsersRoomController],
  providers: [
    UsersRoomService,
    UsersRoomRepository,
    UsersRoomMapper,
  ],
  exports: []
})
export class UsersRoomModule {}
