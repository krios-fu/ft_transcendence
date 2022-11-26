import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendshipEntity } from './entities/friendship.entity';
import { UserEntity } from './entities/user.entity';
import { FriendMapper } from './friendship.mapper';
import { FriendshipRepository } from './repositories/friendship.repository';
import { UserRepository } from './repositories/user.repository';
import { FriendshipService } from './services/friendship.service';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, FriendshipEntity])
    ],
    exports: [UserService], //Usado por el módulo externo AuthModule
    controllers: [UserController],
    providers: [
        UserService,
        UserRepository,
        FriendMapper,
        FriendshipService,
        FriendshipRepository,
    ]
})
export class UserModule { }
