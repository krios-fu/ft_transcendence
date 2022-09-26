import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './entities/room.entity';
import { RoomRepository } from './repositories/room.repository';
import { RoomMapper } from './room.mapper';
import { UserModule } from 'src/user/user.module';
import { RolesRoomModule } from 'src/roles_room/roles_room.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoomEntity,
    ]),
    UserModule,
  ],
  controllers: [RoomController],
  providers: [
    RoomService, 
    RoomMapper,
    RoomRepository,
  ],
  exports: [RoomService]
})
export class RoomModule { }

