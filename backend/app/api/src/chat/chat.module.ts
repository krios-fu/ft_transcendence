import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ChatEntity} from "./entities/chat.entity";
import {MessageEntity} from "./entities/message.entity";
import {UserModule} from "../user/user.module";
import { ChatGateway } from './chat.gateway';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ChatEntity,
            MessageEntity
        ]),
        UserModule,
    ],
    providers: [ChatGateway],
})
export class ChatModule {}
