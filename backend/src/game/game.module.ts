import { Module } from '@nestjs/common';
import { LoserModule } from 'src/match/loser/loser.module';
import { MatchModule } from 'src/match/match.module';
import { WinnerModule } from 'src/match/winner/winner.module';
import { UserModule } from 'src/user/user.module';
import { GameBallPhysicsService } from './game.ballPhysics.service';
import { GameGateway } from './game.gateway';
import { GameHeroPhysicsService } from './game.heroPhysics.service';
import { GameQueueService } from './game.queueService';
import { GameRankingService } from './game.rankingService';
import { GameReconciliationService } from './game.reconciliation.service';
import { GameService } from './game.service';
import { GameSnapshotService } from './game.snapshot.service';
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
    GameReconciliationService,
    GameBallPhysicsService,
    GameHeroPhysicsService,
    GameHeroPhysicsService,
    GameSnapshotService,
    SocketHelper
  ],
})
export class GameModule {}
