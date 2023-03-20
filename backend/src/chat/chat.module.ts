import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatEntity } from "./entities/chat.entity";
import { ChatMessageEntity } from "./entities/chat-message.entity";
import { UserModule } from "../user/user.module";
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatMapper } from "./mapper/chat.mapper";
import { ChatMessageController } from './message/chat-message.controller';
import { ChatMessageService } from './message/chat-message.service';
import { ChatUserEntity } from './entities/chat-user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
<<<<<<< HEAD
            MessageEntity,
            ChatEntity,
=======
            ChatEntity,
            ChatMessageEntity,
            ChatUserEntity
>>>>>>> main
        ]),
        UserModule,
    ],
    exports: [ChatService],
    providers: [
        ChatGateway,
        ChatService,
        ChatMapper,
        ChatMessageService],
    controllers: [ChatController, ChatMessageController],
})
export class ChatModule {}
