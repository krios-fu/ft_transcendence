import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesEntity } from './entity/roles.entity';
import { RolesRepository } from './repository/roles.repository';
import { RolesMapper } from './roles.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([RolesEntity]),
  ],
  controllers: [RolesController],
  providers: [
    RolesService,
    RolesRepository,
    RolesMapper,
  ],
  exports: [RolesService],
})
export class RolesModule { }
