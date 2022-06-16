import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserMapper } from './user.mapper';
import { FriendshipController } from './friendship/friendship.controller';
import { FriendshipService } from './friendship/friendship.service';
import { FriendshipRepository } from './friendship/friendship.repository';
import { FriendMapper } from './friendship/friendship.mapper';
import { FriendshipEntity } from './friendship/friendship.entity';
import { BlockController } from './block/block.controller';
import { BlockService } from './block/block.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, FriendshipEntity])
    ],
    exports: [UserService], //Usado por el módulo externo AuthModule
    controllers: [UserController, FriendshipController, BlockController],
    providers: [
        UserService,
        UserRepository,
        UserMapper,
        FriendshipService,
        FriendshipRepository,
        FriendMapper,
        BlockService
    ]
})
export class UserModule {
    constructor() {
        console.log("UserModule inicializado");
    }
}
