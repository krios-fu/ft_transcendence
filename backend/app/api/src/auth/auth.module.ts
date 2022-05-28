import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { FortyTwoStrategy } from './fortytwo.strategy';

@Module({
    imports: [
        UsersModule,
        PassportModule.register({
            defaultStrategy: 'jwt',
            property: 'users',
            session: false,
        }),
        JwtModule.register({
            secret: process.env.FORTYTWO_APP_SECRET,
            signOptions: { expiresIn: '60s' },
        }), /* Configuración necesaria para la función sign */
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
