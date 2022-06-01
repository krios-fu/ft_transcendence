import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomEntity])
  ],
  providers: [
    RoomService,
  ],
  controllers: [RoomController],
  exports: [RoomService],
})
export class RoomModule {}
