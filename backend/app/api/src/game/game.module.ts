import { Module } from '@nestjs/common';
import { LoserModule } from 'src/match/loser/loser.module';
import { MatchModule } from 'src/match/match.module';
import { WinnerModule } from 'src/match/winner/winner.module';
import { UserModule } from 'src/user/user.module';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  imports: [
    UserModule,
    MatchModule,
    WinnerModule,
    LoserModule
  ],
  providers: [
    GameGateway,
    GameService
  ],
})
export class GameModule {}
