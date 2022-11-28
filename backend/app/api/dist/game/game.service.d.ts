import { MatchService } from "src/match/match.service";
import { UserEntity } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { IGameResult } from "./elements/Game";
import { GameQueueService } from "./game.queueService";
import { GameRankingService } from "./game.rankingService";
export declare class GameService {
    private readonly userService;
    private readonly rankingService;
    private readonly queueService;
    private readonly matchService;
    private gamePlayers;
    constructor(userService: UserService, rankingService: GameRankingService, queueService: GameQueueService, matchService: MatchService);
    startGame(gameId: string): [UserEntity, UserEntity];
    private isOfficial;
    private saveRankings;
    private updateCategory;
    private updatePlayerRankings;
    private createPlayerEntities;
    private saveMatch;
    private getWinner;
    endGame(gameId: string, gameResult: IGameResult): Promise<void>;
}
