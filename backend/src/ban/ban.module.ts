import { Module } from '@nestjs/common';
import { BanService } from './ban.service';
import { BanController } from './ban.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BanEntity } from './entity/ban.entity';
import { BanRepository } from './repository/ban.repository';
import { UserModule } from '../user/user.module';
import { RoomModule } from '../room/room.module';
import {SocketHelper} from "../game/game.socket.helper";

@Module({
  imports: [ 
    TypeOrmModule.forFeature([BanEntity]),
    UserModule,
    RoomModule,
  ],
  providers: [
    SocketHelper,
    BanService,
    BanRepository,
  ],
  controllers: [BanController],
  exports: [BanService]
})
export class BanModule { }
