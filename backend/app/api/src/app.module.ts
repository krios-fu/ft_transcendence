import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { RoomModule } from './room/room.module';
import { RoomChatModule } from './room-chat/room-chat.module';
import { BanModule } from './ban/ban.module';
import { RolesUserModule } from './roles_user/roles_user.module';
import { RolesRoomModule } from './roles_room/roles_room.module';
import { RolesModule } from './roles/roles.module';
import { UsersRoomModule } from './users_room/users_room.module';
import { RoomRolesModule } from './room_roles/room_roles.module';

@Module({
    imports: [
        UserModule,
        AuthModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: 5432,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWD,
            database: process.env.DB_NAME,
            entities: ["dist/**/*.entity{.ts,.js}"],
            synchronize: true,
        }),
        RolesModule,
        RoomModule,
        RoomChatModule,
        UsersRoomModule,
        RolesUserModule,
        RolesRoomModule,
        BanModule,
        RoomRolesModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule { }
