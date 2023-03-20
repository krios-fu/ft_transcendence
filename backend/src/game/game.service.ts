import { Injectable } from "@nestjs/common";
import { LoserEntity } from "src/match/loser/loser.entity";
import { MatchDto } from "src/match/match.dto";
import { MatchEntity } from "src/match/match.entity";
import { MatchService } from "src/match/match.service";
import { WinnerEntity } from "src/match/winner/winner.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Category } from "../user/enum/category.enum";
import { UserService } from "src/user/services/user.service";
import { UpdateResult } from "typeorm";
import { IGameResult } from "./elements/Game";
import { GameRankingService } from "./game.rankingService";
import { GameAchievementsService } from "./game.achievements.service";
import { GameDataService, Players } from "./game.data.service";

@Injectable()
export class    GameService {

    constructor(
        private readonly userService: UserService,
        private readonly gameDataService: GameDataService,
        private readonly rankingService: GameRankingService,
        private readonly matchService: MatchService,
        private readonly achievementsService: GameAchievementsService
    ) {}

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
            resultA = this.userService.updateUser(playerA.id, {
                ranking: playerA.ranking,
                category: playerA.category
            });
            resultB = this.userService.updateUser(playerB.id, {
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

    private async updatePlayerRankings(players: Players,
                                            winner: number): Promise<boolean> {
        [ players.a.ranking, players.b.ranking ] =
            this.rankingService.updateRanking(
                {ranking: players.a.ranking, category: players.a.category},
                {ranking: players.b.ranking, category: players.b.category},
                winner
            );
        players.a.category = await this.updateCategory(
            players.a.username,
            players.a.ranking,
            players.a.category
        );
        players.b.category = await this.updateCategory(
            players.b.username,
            players.b.ranking,
            players.b.category
        );
        return (await this.saveRankings(players.a, players.b));
    }

    private createPlayerEntities(players: Players,
                                    gameResult: IGameResult)
                                        : [WinnerEntity, LoserEntity] {
        let     winnerEntity: WinnerEntity = new WinnerEntity;
        let     loserEntity: LoserEntity = new LoserEntity;
        const   winnerNick: string = gameResult.winnerNick;
        const   [winnerUser, loserUser]: [UserEntity, UserEntity]
                                    = players.a.nickName === winnerNick
                                        ? [players.a, players.b]
                                        : [players.b, players.a];

        winnerEntity.user = winnerUser;
        winnerEntity.ranking = winnerUser.ranking;
        winnerEntity.category = winnerUser.category;
        winnerEntity.score = gameResult.winnerScore;
        loserEntity.user = loserUser;
        loserEntity.ranking = loserUser.ranking;
        loserEntity.category = loserUser.category;
        loserEntity.score = gameResult.loserScore;
        return ([winnerEntity, loserEntity]);
    }

    private async saveMatch(players: Players,
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
    **  User ranking and achievements update and match insertion must be done
    **  in a transaction.
    **  Determine failure handling.
    */
    async endGame(gameId: string, gameResult: IGameResult): Promise<void> {
        const   players: Players = this.gameDataService.getPlayers(gameId);
        let     isOfficial: boolean;
        let     winner: number;

        // Matches cancelled because of lag don't satisfy this condition
        if (gameResult.winnerScore === gameResult.loserScore)
            return ;
        isOfficial = this.isOfficial(gameId);
        winner = this.getWinner(players.a, gameResult);
        if (!(await this.saveMatch(players, gameResult, isOfficial)))
            console.error(`Failed database insertion for match: ${gameId}`);
        if (!isOfficial)
            return ;
        if (!(await this.updatePlayerRankings(players, winner)))
            return ;
        await this.achievementsService.updateAchievements(players.a);
        await this.achievementsService.updateAchievements(players.b);
    }

}
