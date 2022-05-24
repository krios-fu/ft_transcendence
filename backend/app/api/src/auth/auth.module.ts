import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FortytwoStrategy } from './fortytwo.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, FortytwoStrategy],
  imports: [ UserModule ],
})
export class AuthModule {}
