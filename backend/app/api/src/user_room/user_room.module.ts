import { Module } from '@nestjs/common';
import { UsersRoomService } from './user_room.service';
import { UsersRoomController } from './user_room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRoomEntity } from './entity/user_room.entity';
import { UsersRoomRepository } from './repository/user_room.repository';
import { UsersRoomMapper } from './user_room.mapper';
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
