import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './entity/room.entity';
import { RoomRepository } from './repository/room.repository';
import { UserModule } from 'src/user/user.module';

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
  ],
  exports: [RoomService]
})
export class RoomModule { }

