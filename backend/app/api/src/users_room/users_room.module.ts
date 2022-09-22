import { Module } from '@nestjs/common';
import { UsersRoomService } from './users_room.service';
import { UsersRoomController } from './users_room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRoomEntity } from './entities/users_room.entity';
import { UsersRoomRepository } from './repositories/users_room.repository';
import { UsersRoomMapper } from './users_room.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersRoomEntity]),
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
