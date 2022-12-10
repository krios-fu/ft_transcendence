import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ChatEntity} from "./entities/chat.entity";
import {MessageEntity} from "./entities/message.entity";
import {UserModule} from "../user/user.module";
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import {ChatMapper} from "./mapper/chat.mapper";
import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ChatEntity,
            MessageEntity,
        ]),
        UserModule,
    ],
    exports: [ChatService],
    providers: [ChatGateway, ChatService, ChatMapper, MessageService],
    controllers: [ChatController, MessageController],
})
export class ChatModule {}