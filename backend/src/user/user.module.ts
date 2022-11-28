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
    controllers: [UserController, BlockController],
    providers: [
        UserService,
        UserRepository,
        FriendMapper,
        FriendshipService,
        FriendshipRepository,
        FriendMapper,
        BlockService,
        BlockRepository,
        ChatService,
        ChatMapper
    ]
})
export class UserModule { }
