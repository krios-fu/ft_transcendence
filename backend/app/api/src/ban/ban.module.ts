import { Module } from '@nestjs/common';
import { BanService } from './ban.service';
import { BanController } from './ban.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BanEntity } from './entity/ban.entity';
import { UserModule } from 'src/user/user.module';
import { RoomModule } from 'src/room/room.module';
import { BanMapper } from './ban.mapper';
import { BanRepository } from './ban.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([BanEntity]),
//    UserModule,
//    RoomModule,
  ],
  providers: [
    BanService,
    BanRepository,
    BanMapper,
  ],
  controllers: [BanController],
  exports: []
})
export class BanModule {}
