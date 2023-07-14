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
import { AuthModule } from 'src/auth/auth.module';
import { GameModule } from 'src/game/game.module';
import { RoomModule } from 'src/room/room.module';
import { UserRoomModule } from 'src/user_room/user_room.module';
import { UserRolesModule } from 'src/user_roles/user_roles.module';
import { UserRoomRolesModule } from 'src/user_room_roles/user_room_roles.module';
import { BanModule } from 'src/ban/ban.module';
import { RoomRolesModule } from 'src/room_roles/room_roles.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ChatEntity,
            ChatMessageEntity,
            ChatUserEntity,
        ]),
        AuthModule,
        GameModule,
        UserModule,
        RoomModule,
        UserRoomModule,
        UserRolesModule,
        UserRoomRolesModule,
        BanModule,
        RoomRolesModule


    ],
    exports: [ChatService],
    providers: [
        ChatGateway,
        ChatService,
        ChatMapper,
        ChatMessageService],
    controllers: [ChatController, ChatMessageController],
})
export class ChatModule { }
