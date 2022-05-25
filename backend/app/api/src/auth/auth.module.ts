import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './local.strategy';

@Module({
    imports: [UserModule, PassportModule],
    providers: [AuthService, LocalStrategy]
})
export class AuthModule { }
