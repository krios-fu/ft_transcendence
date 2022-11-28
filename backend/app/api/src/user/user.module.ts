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
import { BlockRepository } from './block/block.repository';
import { BlockEntity } from './block/block.entity';
import { ChatService } from 'src/chat/chat.service';
import { ChatEntity } from 'src/chat/entities/chat.entity';
import { ChatMapper } from 'src/chat/mapper/chat.mapper';
@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, FriendshipEntity, BlockEntity, ChatEntity])
        
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
        BlockService,
        BlockRepository,
        ChatService,
        ChatMapper
    ]
})
export class UserModule {
    constructor() {
        console.log("UserModule inicializado");
    }
}
