import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './room.entity';
import { RoomRepository } from './room.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomEntity])
  ],
  controllers: [RoomController],
  providers: [
    RoomService, 
    RoomRepository
  ],
})
export class RoomModule {}

