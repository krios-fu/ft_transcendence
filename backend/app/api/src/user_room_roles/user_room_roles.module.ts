import { Module } from '@nestjs/common';
import { UserRoomRolesService } from './user_room_roles.service';
import { UserRoomRolesController } from './user_room_roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoomRolesEntity } from './entity/user_room_roles.entity';
import { UserRoomModule } from 'src/user_room/user_room.module';
import { RolesModule } from 'src/roles/roles.module';
import { UserRoomRolesRepository } from './repository/user_room_roles.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRoomRolesEntity]),
    UserRoomModule,
    RolesModule,
  ],
  providers: [
    UserRoomRolesService,
    UserRoomRolesRepository,
  ],
  controllers: [UserRoomRolesController],
  exports: [UserRoomRolesService],
})
export class UserRoomRolesModule { }
