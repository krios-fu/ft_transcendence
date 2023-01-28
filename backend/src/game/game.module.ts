import { Module } from '@nestjs/common';
import { LoserModule } from '../match/loser/loser.module';
import { MatchModule } from '../match/match.module';
import { WinnerModule } from '../match/winner/winner.module';
import { UserModule } from '../user/user.module';
import { GameGateway } from './game.gateway';
import { GameQueueService } from './game.queueService';
import { GameRankingService } from './game.rankingService';
import { GameService } from './game.service';
import { SocketHelper } from './game.socket.helper';
import { GameUpdateService } from './game.updateService';

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
    GameUpdateService,
    GameRankingService,
    SocketHelper
  ],
})
export class GameModule {}
