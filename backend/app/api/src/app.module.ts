import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { RoomModule } from './room/room.module';
import { BanModule } from './ban/ban.module';
import { UserRolesModule } from './user_roles/user_roles.module';
import { UserRoomRolesModule } from './user_room_roles/user_room_roles.module';
import { RolesModule } from './roles/roles.module';
import { UserRoomModule } from './user_room/user_room.module';
import { RoomRolesModule } from './room_roles/room_roles.module';
import { AchievementsModule } from './achievements/achievements.module';
import { AchievementsUserModule } from './achievements_user/achievements_user.module';

@Module({
    imports: [
        UserModule,
        //AuthModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: 5432,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWD,
            database: process.env.DB_NAME,
            entities: ["dist/**/*.entity{.ts,.js}"],
            synchronize: true
        }),
        RolesModule,
        RoomModule,
        UserRoomModule,
        UserRolesModule,
        UserRoomRolesModule,
        BanModule,
        RoomRolesModule,
        AchievementsModule,
        AchievementsUserModule,
    ],
    controllers: [],
    providers: [
    //    {
    //        provide: APP_GUARD,
    //        useClass: JwtAuthGuard,
    //    },
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor,
        }
    ],
    exports: []
})
export class AppModule { }
