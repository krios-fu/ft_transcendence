import { Module } from '@nestjs/common';
import { LoserModule } from 'src/match/loser/loser.module';
import { MatchModule } from 'src/match/match.module';
import { WinnerModule } from 'src/match/winner/winner.module';
import { UserModule } from 'src/user/user.module';
import { GameGateway } from './game.gateway';
import { GameQueueService } from './game.queueService';
import { GameRankingService } from './game.rankingService';
import { GameService } from './game.service';
import { SocketHelper } from './game.socket.helper';

@Module({
  imports: [
    UserModule,
    MatchModule,
    WinnerModule,
    LoserModule
  ],
  providers: [
    GameGateway,
    GameService,
    GameQueueService,
    GameRankingService,
    SocketHelper
  ],
})
export class GameModule {}
