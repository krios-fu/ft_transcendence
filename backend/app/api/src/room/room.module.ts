import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './room.entity';
import { RoomRepository } from './room.repository';
import { RoomMapper } from './room.mapper';
import { RolesRepository } from './roles.repository';
import { UserModule } from 'src/user/user.module';
import { RolesEntity } from './roles.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoomEntity,
      RolesEntity
    ]),
    UserModule
  ],
  controllers: [RoomController],
  providers: [
    RoomService, 
    RoomRepository,
    RoomMapper,
    RolesRepository
  ],
})
export class RoomModule {}

