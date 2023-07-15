import { Module } from '@nestjs/common';
import { UserRoomRolesService } from './user_room_roles.service';
import { UserRoomRolesController } from './user_room_roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoomRolesEntity } from './entity/user_room_roles.entity';
import { UserRoomModule } from '../user_room/user_room.module';
import { RolesModule } from '../roles/roles.module';
import { UserRoomRolesRepository } from './repository/user_room_roles.repository';
import { RoomModule } from '../room/room.module';
import { UserModule } from '../user/user.module';
import { UserRolesModule } from 'src/user_roles/user_roles.module';
import { BanModule } from 'src/ban/ban.module';
import { BanService } from 'src/ban/ban.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRoomRolesEntity]),
    UserRoomModule,
    UserRolesModule,
    RoomModule,
    RolesModule,
    UserModule
  ],
  providers: [
    UserRoomRolesService,
    UserRoomRolesRepository,
  ],
  controllers: [UserRoomRolesController],
  exports: [UserRoomRolesService],
})
export class UserRoomRolesModule { }
