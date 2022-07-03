import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { FortyTwoStrategy } from './strategy/fortytwo.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './entity/refresh-token.entity';
import { RefreshTokenRepository } from './repository/refresh-token.repository';

@Module({
    imports: [
        UserModule,
        PassportModule,
        TypeOrmModule.forFeature([
           RefreshTokenEntity, 
        ]),
        JwtModule.register({
            secret: process.env.FORTYTWO_APP_SECRET,
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        FortyTwoStrategy,
        RefreshTokenRepository,
    ],
    exports: [
        PassportModule,
        JwtModule,
    ],
})
export class AuthModule { }
