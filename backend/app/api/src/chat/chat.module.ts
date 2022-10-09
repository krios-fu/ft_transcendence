import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ChatEntity} from "./entities/chat.entity";
import {MessageEntity} from "./entities/message.entity";
import {UserModule} from "../user/user.module";
import { ChatGateway } from './chat.gateway';
import {MembershipEntity} from "./entities/membership.entity";
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ChatEntity,
            MessageEntity,
            MembershipEntity,
        ]),
        UserModule,
    ],
    providers: [ChatGateway, ChatService],
    controllers: [ChatController],
})
export class ChatModule {}
