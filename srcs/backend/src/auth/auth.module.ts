import { Logger, Module } from '@nestjs/common';
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
import { TwoFactorStrategy } from './strategy/two-factor.strategy';
import { UserRolesModule } from '../user_roles/user_roles.module';
import { EncryptionService } from './service/encryption.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            RefreshTokenEntity, 
         ]),
        UserModule,
        UserRolesModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.FORTYTWO_APP_SECRET,
            signOptions: {
                expiresIn: 2 * 60,
            }
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        TwoFactorStrategy,
        FortyTwoStrategy,
        RefreshTokenRepository,
        Logger,
        EncryptionService
    ],
    exports: [
        PassportModule,
        JwtModule,
        AuthService,
        EncryptionService
    ],
})
export class AuthModule { }
