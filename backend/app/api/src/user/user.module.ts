import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserMapper } from './user.mapper';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity])
    ],
    exports: [UserService], //Usado por el módulo externo AuthModule
    controllers: [UserController],
    providers: [
        UserService,
        UserRepository,
        UserMapper,
    ]
})
export class UserModule {
    constructor() {
        console.log("UserModule inicializado");
    }
}
