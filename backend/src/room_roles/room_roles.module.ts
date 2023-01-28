import { Module } from '@nestjs/common';
import { RoomRolesService } from './room_roles.service';
import { RoomRolesController } from './room_roles.controller';
import { RoomRolesRepository } from './repository/room_roles.repository';
import { RoomRolesEntity } from './entity/room_roles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomModule } from '../room/room.module';
import { RolesModule } from '../roles/roles.module';
import { UserRolesModule } from '../user_roles/user_roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomRolesEntity]),
    RoomModule,
    UserRolesModule,
    RolesModule,
  ],
  controllers: [RoomRolesController],
  providers: [
    RoomRolesRepository,
    RoomRolesService,
  ],
  exports: [RoomRolesService]
})
export class RoomRolesModule { }
