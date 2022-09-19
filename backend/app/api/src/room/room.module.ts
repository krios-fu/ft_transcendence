import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './entities/room.entity';
import { RoomRepository } from './repositories/room.repository';
import { RoomMapper } from './room.mapper';
import { RolesRepository } from './repositories/roles.repository';
import { RoomMsgRepository } from './repositories/room-msg.repository';
import { UserModule } from 'src/user/user.module';
import { RolesEntity } from 'src/entity/roles.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoomEntity,
      RolesEntity,
    ]),
    UserModule,
  ],
  controllers: [RoomController],
  providers: [
    RoomService, 
    RoomMapper,
    RoomRepository,
    RolesRepository,
    RoomMsgRepository,
  ],
})
export class RoomModule {}

