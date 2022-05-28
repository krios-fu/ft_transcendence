import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { UsersMapper } from './users.mapper';

@Module({
    imports: [TypeOrmModule.forFeature([UsersEntity])],
    exports: [UsersService],        /* Va a ser usado por el módulo externo AuthModule */
    controllers: [UsersController],
    providers: [
        UsersService,
        UsersRepository,
        UsersMapper,
    ]
})
export class UsersModule {
    constructor() {
        console.log("UsersModule inicializado");
    }
}
