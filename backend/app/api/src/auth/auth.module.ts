import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { FortyTwoStrategy } from './strategy/fortytwo.strategy';
import { RoomModule } from 'src/room/room.module';

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.FORTYTWO_APP_SECRET,
            signOptions: { expiresIn: '60s' },
        }),
        RoomModule
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        FortyTwoStrategy,
    ],
    exports: [
        PassportModule,
        JwtModule,
    ],
})
export class AuthModule { }
