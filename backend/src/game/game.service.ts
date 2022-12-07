import { Injectable } from "@nestjs/common";
import { LoserEntity } from "src/match/loser/loser.entity";
import { MatchDto } from "src/match/match.dto";
import { MatchEntity } from "src/match/match.entity";
import { MatchService } from "src/match/match.service";
import { WinnerEntity } from "src/match/winner/winner.entity";
import {
    Category,
    UserEntity
} from "src/user/entities/user.entity";
import { UserService } from "src/user/services/user.service";
import { UpdateResult } from "typeorm";
import { IGameResult } from "./elements/Game";
import { GameQueueService } from "./game.queueService";
import { GameRankingService } from "./game.rankingService";

@Injectable()
export class    GameService {
    private gamePlayers: Map<string, [UserEntity, UserEntity]>;

    constructor(
        private readonly userService: UserService,
        private readonly rankingService: GameRankingService,
        private readonly queueService: GameQueueService,
        private readonly matchService: MatchService
    ) {
        this.gamePlayers = new Map<string, [UserEntity, UserEntity]>;
    }

    getPlayers(gameId: string): [UserEntity, UserEntity] {
        return (this.gamePlayers.get(gameId));
    }

    startGame(gameId: string): [[UserEntity, UserEntity], number] {
        let nextPlayers: [UserEntity, UserEntity] = [undefined, undefined];
        let gameType: number;
        let currentPlayers: [UserEntity, UserEntity];
    
        [nextPlayers[0], nextPlayers[1], gameType] =
                                    this.queueService.getNextPlayers(gameId);
        if (nextPlayers[0] === undefined)
            return ([nextPlayers, gameType]);
        currentPlayers = this.gamePlayers.get(gameId);
        if (currentPlayers === undefined)
        {
            currentPlayers = this.gamePlayers.set(
                gameId, [undefined, undefined]
            ).get(gameId);
        }
        currentPlayers[0] = nextPlayers[0];
        currentPlayers[1] = nextPlayers[1];
        return ([nextPlayers, gameType]);
    }

    private isOfficial(gameId: string): boolean {
        // Pending ...
        return (true);
    }

    /*
    **  IMPORTANT!!!
    **
    **  This must be implemented in a transaction to ensure
    **  both Users get updated, or none of them.
    */
    private async saveRankings(playerA: UserEntity,
                                playerB: UserEntity): Promise<boolean> {
        let resultA: Promise<UpdateResult>;
        let resultB: Promise<UpdateResult>;
    
        try {
            resultA = this.userService.updateUserStats(playerA.id, {
                ranking: playerA.ranking,
                category: playerA.category
            });
            resultB = this.userService.updateUserStats(playerB.id, {
                ranking: playerB.ranking,
                category: playerB.category
            });
            await resultA;
            await resultB;
        }
        catch(err) {
            console.error(err);
            return (false);
        }
        return (true);
    }

    /*
    **  A higher number of minMathes is needed to determine
    **  with higher accuracy the actual Category of a Player,
    **  but for testing and fast presentation purposes it is set
    **  to a low value.
    */
    private async updateCategory(username: string, ranking: number,
                                    category: Category): Promise<Category> {
        const   minMatches: number = 3;
    
        if (category === Category.Pending)
        {
            if (await this.matchService.countUserMatches(username) < minMatches)
                return (category);
        }
        return (this.rankingService.getCategory(ranking));
    }

    private async updatePlayerRankings(players: [UserEntity, UserEntity],
                                            winner: number): Promise<boolean> {    
        [ players[0].ranking, players[1].ranking ] =
            this.rankingService.updateRanking(
                {ranking: players[0].ranking, category: players[0].category},
                {ranking: players[1].ranking, category: players[1].category},
                winner
        );
        players[0].category = await this.updateCategory(
            players[0].username,
            players[0].ranking,
            players[0].category
        );
        players[1].category = await this.updateCategory(
            players[1].username,
            players[1].ranking,
            players[1].category
        );
        return (await this.saveRankings(players[0], players[1]));
    }

    private createPlayerEntities(players: [UserEntity, UserEntity],
                            gameResult: IGameResult) : [WinnerEntity, LoserEntity] {
        let     winnerEntity: WinnerEntity = new WinnerEntity;
        let     loserEntity: LoserEntity = new LoserEntity;
        const   winnerNick: string = gameResult.winnerNick;

        winnerEntity.user = players[0].nickName === winnerNick
                            ? players[0] : players[1];
        winnerEntity.score = gameResult.winnerScore;
        loserEntity.user = players[0].nickName != winnerNick
                            ? players[0] : players[1];
        loserEntity.score = gameResult.loserScore;
        return ([winnerEntity, loserEntity]);
    }

    private async saveMatch(players: [UserEntity, UserEntity],
                                gameResult: IGameResult, isOfficial: boolean)
                                : Promise<MatchEntity> {
        let matchDto: MatchDto = new MatchDto;
    
        [ matchDto.winner, matchDto.loser ] =
            this.createPlayerEntities(players, gameResult);
        matchDto.official = isOfficial;
        return (await this.matchService.addMatch(matchDto));
    }

    private getWinner(playerA: UserEntity, gameResult: IGameResult): number {
        return (playerA.nickName === gameResult.winnerNick
                    ? 0 : 1);
    }

    /*
    **  User ranking update and match insertion must be done in a transaction.
    **  Determine failure handling.
    */
    async endGame(gameId: string, gameResult: IGameResult): Promise<void> {
        const   players: [UserEntity, UserEntity] = this.gamePlayers.get(gameId);
        let     isOfficial: boolean;
        let     winner: number;

        isOfficial = this.isOfficial(gameId);
        winner = this.getWinner(players[0], gameResult);
        if (!(await this.saveMatch(players, gameResult, isOfficial)))
            console.error(`Failed database insertion for match: ${gameId}`);
        if (isOfficial)
        {
            if (!(await this.updatePlayerRankings(players, winner)))
                return ;
        }
        players[0] = undefined;
        players[1] = undefined;
        return ;
    }

}
