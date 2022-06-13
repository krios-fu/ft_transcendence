import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { ChatModule } from './chat/chat.module';
import { RoomModule } from './room/room.module';


@Module({
    imports: [
        AuthModule,
        UserModule,
        ChatModule,
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
        RoomModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        }
    ],
})
export class AppModule { }
