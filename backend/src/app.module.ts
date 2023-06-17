import {ClassSerializerInterceptor, MiddlewareConsumer, Module} from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { ChatModule } from './chat/chat.module';
import { RoomModule } from './room/room.module';
import { BanModule } from './ban/ban.module';
import { UserRolesModule } from './user_roles/user_roles.module';
import { UserRoomRolesModule } from './user_room_roles/user_room_roles.module';
import { RolesModule } from './roles/roles.module';
import { UserRoomModule } from './user_room/user_room.module';
import { RoomRolesModule } from './room_roles/room_roles.module';
import { AchievementsModule } from './achievements/achievements.module';
import { AchievementsUserModule } from './achievements_user/achievements_user.module';
import { MatchModule } from './match/match.module';
import { GameModule } from './game/game.module';
import { WinnerModule } from './match/winner/winner.module';
import { LoserModule } from './match/loser/loser.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { EventEmitterModule } from '@nestjs/event-emitter';


@Module({
    imports: [
        UserModule,
        AuthModule,
        ChatModule,
        MulterModule.register({
            dest: './static',
        }),
        //ThrottlerModule.forRoot({
        //    ttl: 10, limit: 5
        //}),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: 5432,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            entities: ["dist/**/*.entity{.ts,.js}"],
            synchronize: true, // should be managed in dev only,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'static'),
            serveRoot: '/static',
            serveStaticOptions: {
                index: false
            }
        }),
        EventEmitterModule.forRoot(),
        RolesModule,
        RoomModule,
        UserRoomModule,
        UserRolesModule,
        UserRoomRolesModule,
        BanModule,
        RoomRolesModule,
        AchievementsModule,
        AchievementsUserModule,
        MatchModule,
        WinnerModule,
        LoserModule,
        GameModule
    ],
    controllers: [],
    providers: [
        //{
        //    provide: APP_GUARD,
        //    useClass: ThrottlerGuard
        //},
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor,
        }
    ],
    exports: []
})
export class AppModule { }
