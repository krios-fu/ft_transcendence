import { Injectable } from "@nestjs/common";
import { LoserEntity } from "src/match/loser/loser.entity";
import { MatchDto } from "src/match/match.dto";
import { MatchEntity } from "src/match/match.entity";
import { MatchService } from "src/match/match.service";
import { WinnerEntity } from "src/match/winner/winner.entity";
import { UserEntity } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { UpdateResult } from "typeorm";
import { Game } from "./elements/Game";
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

    startGame(gameId: string): [UserEntity, UserEntity] {
        let nextPlayers: [UserEntity, UserEntity] =
                            this.queueService.getNextPlayers(gameId);
        let currentPlayers: [UserEntity, UserEntity];
    
        if (nextPlayers[0] === undefined)
            return (nextPlayers);
        currentPlayers = this.gamePlayers.get(gameId);
        if (currentPlayers === undefined)
        {
            currentPlayers = this.gamePlayers.set(
                gameId, [undefined, undefined]
            ).get(gameId);
        }
        currentPlayers[0] = nextPlayers[0];
        currentPlayers[1] = nextPlayers[1];
        this.queueService.remove(gameId, nextPlayers[0].username);
        this.queueService.remove(gameId, nextPlayers[1].username);
        return (nextPlayers);
    }

    private isOfficial(gameId: string): boolean {
        // Pending ...
        return (true);
    }

    private async updatePlayerRankings(players: [UserEntity, UserEntity],
                                            winner: number): Promise<boolean> {
        let resultA: Promise<UpdateResult>;
        let resultB: Promise<UpdateResult>;
    
        [ players[0].ranking, players[1].ranking ] =
            this.rankingService.updateRanking(
                players[0].ranking,
                players[1].ranking,
                winner
        );
        players[0].category =
            this.rankingService.getCategory(players[0].category);
        players[1].category =
            this.rankingService.getCategory(players[1].category);
        try {
            resultA = this.userService.updateUser(players[0].username, {
                ranking: players[0].ranking,
                category: players[0].category
            });
            resultB = this.userService.updateUser(players[1].username, {
                ranking: players[1].ranking,
                category: players[1].category
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

    private createPlayerEntities(players: [UserEntity, UserEntity],
                            game: Game) : [WinnerEntity, LoserEntity] {
        let     winnerEntity: WinnerEntity = new WinnerEntity;
        let     loserEntity: LoserEntity = new LoserEntity;
        const   winnerNick: string = game.getWinnerNick();

        winnerEntity.user = players[0].nickName === winnerNick
                            ? players[0] : players[1];
        winnerEntity.score = game.getWinnerScore();
        loserEntity.user = players[0].nickName != winnerNick
                            ? players[0] : players[1];
        loserEntity.score = game.getLoserScore();
        return ([winnerEntity, loserEntity]);
    }

    private async saveMatch(players: [UserEntity, UserEntity],
                                gameData: Game, isOfficial: boolean)
                                : Promise<MatchEntity> {
        let matchDto: MatchDto = new MatchDto;
        let playerEntities: [WinnerEntity, LoserEntity];
    
        playerEntities = this.createPlayerEntities(players, gameData);
        matchDto.winner = playerEntities[0];
        matchDto.loser = playerEntities[1];
        matchDto.official = isOfficial;
        return (await this.matchService.addMatch(matchDto));
    }

    private getWinner(playerA: UserEntity, game: Game): number {
        const   winnerNick: string = game.getWinnerNick();

        return (playerA.nickName === winnerNick
                    ? 0 : 1);
    }

    /*
    **  User ranking update and match insertion must be done in a transaction.
    **  Determine failure handling.
    */
    async endGame(gameId: string, gameData: Game): Promise<void> {
        const   players: [UserEntity, UserEntity] = this.gamePlayers.get(gameId);
        let     isOfficial: boolean;
        let     winner: number;

        isOfficial = this.isOfficial(gameId);
        winner = this.getWinner(players[0], gameData);
        if (isOfficial)
        {
            if (!(await this.updatePlayerRankings(players, winner)))
                return ;
        }
        if (!(await this.saveMatch(players, gameData, isOfficial)))
            console.error(`Failed database insertion for match: ${gameId}`);
        players[0] = undefined;
        players[1] = undefined;
        return ;
    }

}
