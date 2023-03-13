import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatEntity } from "./entities/chat.entity";
import { ChatMessageEntity } from "./entities/chat-message.entity";
import {UserModule} from "../user/user.module";
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatMapper } from "./mapper/chat.mapper";
import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';
import { ChatUserEntity } from './entities/chat-user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ChatEntity,
            ChatMessageEntity,
            ChatUserEntity
        ]),
        UserModule,
    ],
    exports: [ChatService],
    providers: [ChatGateway, ChatService, ChatMapper, MessageService],
    controllers: [ChatController, MessageController],
})
export class ChatModule {}
