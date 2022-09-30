import { Module } from '@nestjs/common';
import { BanService } from './ban.service';
import { BanController } from './ban.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BanEntity } from './entity/ban.entity';
import { BanMapper } from './ban.mapper';
import { BanRepository } from './repository/ban.repository';

@Module({
  imports: [ TypeOrmModule.forFeature([BanEntity]) ],
  providers: [
    BanService,
    BanRepository,
    BanMapper,
  ],
  controllers: [BanController],
  exports: []
})
export class BanModule { }
