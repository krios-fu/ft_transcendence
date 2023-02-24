import { forwardRef, Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './entity/room.entity';
import { RoomRepository } from './repository/room.repository';
import { UserModule } from 'src/user/user.module';
import { RoomGateway } from './room.gateway';
import { UserRoomModule } from "../user_room/user_room.module";

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
    RoomRepository,
    RoomGateway
  ],
  exports: [RoomService]
})
export class RoomModule { }

