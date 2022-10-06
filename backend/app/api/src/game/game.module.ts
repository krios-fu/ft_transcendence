import { Module } from '@nestjs/common';
import { MatchModule } from 'src/match/match.module';
import { UserModule } from 'src/user/user.module';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  imports: [
    MatchModule,
    UserModule
  ],
  providers: [
    GameGateway,
    GameService
  ],
})
export class GameModule {}
