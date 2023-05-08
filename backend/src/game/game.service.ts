import { Injectable } from "@nestjs/common";
import { LoserEntity } from "src/match/loser/loser.entity";
import { MatchDto } from "src/match/match.dto";
import { MatchEntity } from "src/match/match.entity";
import { MatchService } from "src/match/match.service";
import { WinnerEntity } from "src/match/winner/winner.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Category } from "../user/enum/category.enum";
import { UserService } from "src/user/services/user.service";
import {
    DataSource,
    QueryRunner
} from "typeorm";
import { IGameResult } from "./elements/Game";
import { GameRankingService } from "./game.rankingService";
import { GameAchievementsService } from "./game.achievements.service";
import { GameDataService, Players } from "./game.data.service";
import { WinnerService } from "src/match/winner/winner.service";
import { LoserService } from "src/match/loser/loser.service";
import { WinnerDto } from "src/match/winner/winner.dto";
import { LoserDto } from "src/match/loser/loser.dto";

interface   MatchData {
    gameId: string;
    players: Players;
    result: IGameResult;
    winner: number;
    official: boolean;
}

@Injectable()
export class    GameService {

    constructor(
        private readonly userService: UserService,
        private readonly gameDataService: GameDataService,
        private readonly rankingService: GameRankingService,
        private readonly matchService: MatchService,
        private readonly winnerService: WinnerService,
        private readonly loserService: LoserService,
        private readonly achievementsService: GameAchievementsService,
        private readonly datasource: DataSource
    ) {}

    private isOfficial(gameId: string): boolean {
        // Pending ...
        return (true);
    }

    private async saveRankings(playerA: UserEntity, playerB: UserEntity,
                                qR: QueryRunner): Promise<void> {
        let     resultA: Promise<UserEntity>;
        let     resultB: Promise<UserEntity>;
        const   results: [Promise<UserEntity>, Promise<UserEntity>] = [
            resultA,
            resultB
        ];
    
        for (const [index, player] of [playerA, playerB].entries())
        {
            results[index] = this.userService.updateUser(player.id, {
                ranking: player.ranking,
                category: player.category
            }, qR);
        }
        await resultA;
        await resultB;
    }

    /*
    **  A higher number of minMatches is needed to determine
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

    private async updatePlayerRankings(players: Players, winner: number,
                                        qR: QueryRunner): Promise<void> {
        [ players.a.ranking, players.b.ranking ] =
            this.rankingService.updateRanking(
                {ranking: players.a.ranking, category: players.a.category},
                {ranking: players.b.ranking, category: players.b.category},
                winner
            );
        for (const player of [players.a, players.b])
        {
            player.category = await this.updateCategory(
                player.username,
                player.ranking,
                player.category
            );
        }
        return (await this.saveRankings(players.a, players.b, qR));
    }

    private async createPlayerEntities(players: Players,
                                        gameResult: IGameResult)
                                        : Promise<[WinnerEntity, LoserEntity]> {
        const   winnerNick: string = gameResult.winnerNick;
        const   [winnerUser, loserUser]: [UserEntity, UserEntity]
                                    = players.a.nickName === winnerNick
                                        ? [players.a, players.b]
                                        : [players.b, players.a];
        const   winnerDto: WinnerDto = {
            user: winnerUser,
            ranking: winnerUser.ranking,
            category: winnerUser.category,
            score: gameResult.winnerScore
        };
        const   loserDto: LoserDto = {
            user: loserUser,
            ranking: loserUser.ranking,
            category: loserUser.category,
            score: gameResult.loserScore
        };
    
        return ([
            await this.winnerService.addWinner(winnerDto),
            await this.loserService.addLoser(loserDto)
        ]);
    }

    private async saveMatch(players: Players, gameResult: IGameResult,
                                isOfficial: boolean, qR: QueryRunner)
                                : Promise<void> {
        const   matchDto: MatchDto = new MatchDto;
    
        [ matchDto.winner, matchDto.loser ] =
            await this.createPlayerEntities(players, gameResult);
        matchDto.official = isOfficial;
        await this.matchService.addMatch(matchDto, qR);
    }

    private getWinner(playerA: UserEntity, gameResult: IGameResult): number {
        return (playerA.nickName === gameResult.winnerNick
                    ? 0 : 1);
    }

    private async startTransaction(data: MatchData,
                                    retries: number): Promise<boolean> {
        const   queryRunner: QueryRunner = this.datasource.createQueryRunner();
        let     result: boolean = true;
    
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await this.saveMatch(data.players, data.result,
                                    data.official, queryRunner);
            if (data.official)
            {
                await this.updatePlayerRankings(data.players, data.winner,
                                                    queryRunner);
                for (const player of [data.players.a, data.players.b])
                {
                    await this.achievementsService.updateAchievements(
                        player,
                        queryRunner
                    );
                }
            }
            await queryRunner.commitTransaction();
        }
        catch(err: any) {
            console.error(`
                Match transaction failed
                MatchData: ${data}
                Retries: ${retries}
                Error: ${err}
            `);
            await queryRunner.rollbackTransaction();
            result = false;
        } finally {
            await queryRunner.release();
        }
        return (result);
    }

    /*
    **  The transaction has a number of maximum retries, and logs the errors
    **  each time it fails. The end user will not be notified about this,
    **  as this operation is not initiated by a user request, but by a server
    **  call that happens when a match finishes.
    **
    **  Logging the errors allows for manual database correction after the
    **  error is discovered thanks to server monitoring.
    */
    async endGame(gameId: string, gameResult: IGameResult): Promise<void> {
        const   players: Players = this.gameDataService.getPlayers(gameId);
        const   matchData: MatchData = {
                    gameId: gameId,
                    players: players,
                    result: gameResult
        } as MatchData;
        let     retries: number;

        // Matches cancelled because of lag satisfy this condition
        if (gameResult.winnerScore === gameResult.loserScore)
            return ;
        matchData.official = this.isOfficial(gameId);
        matchData.winner = this.getWinner(players.a, gameResult);
        retries = 0;
        while (retries < 3)
        {
            if (await this.startTransaction(matchData, retries))
                return ;
            ++retries;
        }
    }

}
