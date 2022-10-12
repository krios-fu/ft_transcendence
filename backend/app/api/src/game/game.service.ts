import { LoserDto } from "src/match/loser/loser.dto";
import { LoserEntity } from "src/match/loser/loser.entity";
import { LoserService } from "src/match/loser/loser.service";
import { MatchDto } from "src/match/match.dto";
import { MatchEntity } from "src/match/match.entity";
import { MatchService } from "src/match/match.service";
import { WinnerDto } from "src/match/winner/winner.dto";
import { WinnerEntity } from "src/match/winner/winner.entity";
import { WinnerService } from "src/match/winner/winner.service";
import { UserEntity } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { UpdateResult } from "typeorm";
import { Game } from "./Game";

/*
**  Provisional
*/
enum    Level {
    Bronze,
    Silver,
    Gold
}

export class    GameService {
    private gameQueue: Map<string, UserEntity[]>;
    private gamePlayers: Map<string, [UserEntity, UserEntity]>;

    constructor(
        private readonly userService: UserService,
        private readonly matchService: MatchService,
        private readonly winnerService: WinnerService,
        private readonly loserService: LoserService
    ) {
        this.gameQueue = new Map<string, UserEntity[]>;
        this.gamePlayers = new Map<string, [UserEntity, UserEntity]>;
    }

    private getPlayerLevel(player: UserEntity): Level {
        //Provisional
        return (Level.Bronze);
    }

    private getNextPlayers(gameId: string): [UserEntity, UserEntity] {
        let queue: UserEntity[] = this.gameQueue.get(gameId);
        let playerA: UserEntity = undefined;
        let playerB: UserEntity = undefined;
        let maxLevelDiff: number = 0;
        let levelDiff: number;

        if (queue.length < 2)
            return ([playerA, playerB]);
        playerA = queue[0];
        while (playerB === undefined)
        {
            for (let i: number = 1; i < queue.length; ++i)
            {
                levelDiff = Math.abs(
                    this.getPlayerLevel(playerA)
                    - this.getPlayerLevel(queue[i])
                );
                if (levelDiff <= maxLevelDiff)
                    playerB = queue[i];
            }
            ++maxLevelDiff;
        }
        return ([playerA, playerB]);
    }

    startGame(gameId: string): [UserEntity, UserEntity] {
        let nextPlayers: [UserEntity, UserEntity] = this.getNextPlayers(gameId);
        let currentPlayers: [UserEntity, UserEntity];
    
        if (nextPlayers[0] === undefined)
            return (nextPlayers);
        currentPlayers = this.gamePlayers.get(gameId);
        currentPlayers = nextPlayers;
        this.removeFromQueue(gameId, nextPlayers[0].username);
        this.removeFromQueue(gameId, nextPlayers[1].username);
        return (nextPlayers);
    }

    gameStarted(gameId: string): boolean {
        return (
            this.gamePlayers.get(gameId)[0] != undefined
        );
    }

    private isOfficial(gameId: string): boolean {
        // Pending ...
        return (true);
    }

    // Returns the probability of target winning rival
    /*private calcExpectedScore(target: PlayerDto, rival: PlayerDto): number {
        return (
            1 / (1 + Math.pow(10, rival.ranking - target.ranking / 400))
        );
    }

    // win = 0 | 1
    private calcRankingUpdate(player: PlayerDto, win: number,
                                expectedScore: number): number {
        return (
            player.ranking + 32 * (win - expectedScore)
        );
    }

    // win = 0 | 1
    updateRanking(playerA: PlayerDto, playerB: PlayerDto, win: number): void {
        let expectA: number;
        let expectB: number;
    
        expectA = this.calcExpectedScore(playerA, playerB);
        expectB = this.calcExpectedScore(playerB, playerA);
        if (!win)
            playerA.ranking = this.calcRankingUpdate(playerA, 0, expectA);
        playerB.ranking = this.calcRankingUpdate(playerB, 1, expectB);
    }*/

    private async   updatePlayerScore(players: [UserEntity, UserEntity],
                                gameData: Game)/*: Promise<UpdateResult>*/ {
        //Pending ...
    }

    private async   savePlayers(players: [UserEntity, UserEntity],
                                gameData: Game)
                                : Promise<[WinnerEntity, LoserEntity]> {
        let winnerDto: WinnerDto;
        let loserDto: LoserDto;
        let winnerEntity: WinnerEntity;
        let loserEntity: LoserEntity;

        winnerDto.user = gameData.playerA.score > gameData.playerB.score
                            ? players[0] : players[1];
        winnerDto.score = gameData.playerA.score > gameData.playerB.score
                            ? gameData.playerA.score : gameData.playerB.score;
        winnerEntity = await this.winnerService.AddWinner(winnerDto);
        loserDto.user = winnerDto.user === players[0]
                        ? players[1] : players[0];
        loserDto.score = winnerDto.user === players[0]
                        ? gameData.playerB.score : gameData.playerA.score;
        loserEntity = await this.loserService.AddLoser(loserDto);
        return ([winnerEntity, loserEntity]);
    }

    private async   saveMatch(players: [UserEntity, UserEntity],
                                gameData: Game, isOfficial: boolean)
                                : Promise<MatchEntity> {
        let matchDto: MatchDto;
        let savedPlayers: [WinnerEntity, LoserEntity];
        let winnerEntity: WinnerEntity;
        let loserEntity: LoserEntity;
    
        savedPlayers = await this.savePlayers(players, gameData);
        if (!savedPlayers[0] || !savedPlayers[1])
            return (null);
        winnerEntity = savedPlayers[0];
        loserEntity = savedPlayers[1];
        matchDto.winner = winnerEntity;
        matchDto.loser = loserEntity;
        matchDto.official = isOfficial;
        return (await this.matchService.addMatch(matchDto));
    }

    /*
    **  User ranking update and match insertion must be done in a transaction.
    **  Determine failure handling.
    **
    **  User id (username) should be included in Player class in order to
    **  link User instance to its respective Player instance.
    */
    async endGame(gameId: string, gameData: Game): Promise<void> {
        const   players: [UserEntity, UserEntity] = this.gamePlayers.get(gameId);
        let     isOfficial: boolean;

        isOfficial = this.isOfficial(gameId);
        if (isOfficial)
        {
            /*if (!(await */this.updatePlayerScore(players, gameData);/*))*/
        }
        if (!(await this.saveMatch(players, gameData, isOfficial)))
            console.log(`Failed database insertion for match: ${gameId}`);
        players[0] = undefined;
        players[1] = undefined;
        return ;
    }

    private findByUsername(username: string, queue: UserEntity[]): number {
        return (queue.findIndex((elem) => {
            elem.username === username
        }));
    }

    async addToQueue(gameId: string, username: string): Promise<void> {
        let targetIndex: number;
        let userEntity: UserEntity = await this.userService.findOne(username);
        let queue: UserEntity[] = this.gameQueue.get(gameId);
    
        if (!queue)
            queue = this.gameQueue.set(gameId, []).get(gameId);
        targetIndex = this.findByUsername(username, queue);
        if (targetIndex === -1
            && userEntity)
            queue.push(userEntity);
    }

    removeFromQueue(gameId: string, username: string): void {
        let queue: UserEntity[] = this.gameQueue.get(gameId);
        let targetIndex: number = this.findByUsername(username, queue);

        if (targetIndex !== -1)
            queue.splice(targetIndex, 1);
    }
}