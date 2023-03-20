import { Module } from '@nestjs/common';
import { AchievementsModule } from 'src/achievements/achievements.module';
import { AchievementsUserModule } from 'src/achievements_user/achievements_user.module';
import { AuthModule } from 'src/auth/auth.module';
import { LoserModule } from 'src/match/loser/loser.module';
import { MatchModule } from 'src/match/match.module';
import { WinnerModule } from 'src/match/winner/winner.module';
import { UserModule } from 'src/user/user.module';
import { GameAchievementsService } from './game.achievements.service';
import { GameDataService } from './game.data.service';
import { GameGateway } from './game.gateway';
import { GameMatchmakingService } from './game.matchmaking.service';
import { GameQueueService } from './game.queueService';
import { GameRankingService } from './game.rankingService';
import { GameReconciliationService } from './game.reconciliation.service';
import { GameRecoveryService } from './game.recovery.service';
import { GameService } from './game.service';
import { SocketHelper } from './game.socket.helper';
import { GameSocketAuthService } from './game.socketAuth.service';
import { GameUpdateService } from './game.updateService';

@Module({
  imports: [
    UserModule,
    MatchModule,
    WinnerModule,
    LoserModule,
    AuthModule,
    AchievementsModule,
    AchievementsUserModule
  ],
  providers: [
    GameGateway,
    GameService,
    GameQueueService,
    GameUpdateService,
    GameRankingService,
    GameReconciliationService,
    SocketHelper,
    GameRecoveryService,
    GameSocketAuthService,
    GameAchievementsService,
    GameDataService,
    GameMatchmakingService
  ],
})
export class GameModule {}
