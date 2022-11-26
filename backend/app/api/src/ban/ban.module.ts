import { Module } from '@nestjs/common';
import { BanService } from './ban.service';
import { BanController } from './ban.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BanEntity } from './entity/ban.entity';
import { BanRepository } from './repository/ban.repository';
import { UserModule } from 'src/user/user.module';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([BanEntity]),
    UserModule,
    RoomModule,
  ],
  providers: [
    BanService,
    BanRepository,
  ],
  controllers: [BanController],
  exports: [BanService]
})
export class BanModule { }
