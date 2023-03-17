import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendshipEntity } from './entities/friendship.entity';
import { UserEntity } from './entities/user.entity';
import { FriendshipRepository } from './repositories/friendship.repository';
import { UserRepository } from './repositories/user.repository';
import { FriendshipService } from './services/friendship.service';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { ChatService } from 'src/chat/chat.service';
import { ChatEntity } from 'src/chat/entities/chat.entity';
import { ChatMapper } from 'src/chat/mapper/chat.mapper';
import { BlockEntity } from './entities/block.entity';
import { BlockService } from './services/block.service';
import { BlockRepository } from './repositories/block.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity, 
            FriendshipEntity, 
            BlockEntity
        ]),
    ],
    exports: [UserService],
    controllers: [UserController],
    providers: [
        UserService,
        UserRepository,
        FriendshipService,
        FriendshipRepository,
        BlockService,
        BlockRepository
    ]
})
export class UserModule { }
