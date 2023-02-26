import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { LoserModule } from 'src/match/loser/loser.module';
import { MatchModule } from 'src/match/match.module';
import { WinnerModule } from 'src/match/winner/winner.module';
import { UserModule } from 'src/user/user.module';
import { GameGateway } from './game.gateway';
import { GameQueueService } from './game.queueService';
import { GameRankingService } from './game.rankingService';
import { GameReconciliationService } from './game.reconciliation.service';
import { GameRecoveryService } from './game.recovery.service';
import { GameService } from './game.service';
import { SocketHelper } from './game.socket.helper';
import { GameUpdateService } from './game.updateService';

@Module({
  imports: [
    UserModule,
    MatchModule,
    WinnerModule,
    LoserModule,
    AuthModule
  ],
  providers: [
    GameGateway,
    GameService,
    GameQueueService,
    GameUpdateService,
    GameRankingService,
    GameReconciliationService,
    SocketHelper,
    GameRecoveryService
  ],
})
export class GameModule {}
