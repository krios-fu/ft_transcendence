import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { UsersEntity } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './user.repository';
import { UsersMapper } from './user.mapper';
// import { RoomModule } from 'src/room/room.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersEntity]),
        // RoomModule,
    ],
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
