import { Module } from '@nestjs/common';
import { BanService } from './ban.service';
import { BanController } from './ban.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BanEntity } from './entity/ban.entity';
import { BanRepository } from './repository/ban.repository';
import { UserModule } from '../user/user.module';
import { RoomModule } from '../room/room.module';
import { UserRolesModule } from 'src/user_roles/user_roles.module';
import { RolesModule } from 'src/roles/roles.module';
import { UserRoomModule } from 'src/user_room/user_room.module';
import { UserRoomRolesModule } from 'src/user_room_roles/user_room_roles.module';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([BanEntity]),
    UserModule,
    RoomModule,
    RolesModule,
    UserRolesModule,
    UserRoomModule,
    UserRoomRolesModule
  ],
  providers: [
    BanService,
    BanRepository,
  ],
  controllers: [BanController],
  exports: [BanService]
})
export class BanModule { }
