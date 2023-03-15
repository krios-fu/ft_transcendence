import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/user/entities/user.entity";
import {
    Game,
    GameState,
    GameType,
    GameUpdateResult,
    IGameClientStart,
    IGameData,
    IGameResult
} from "./elements/Game";
import {
    GameSelection,
    IGameSelectionData,
    SelectionStatus
} from "./elements/GameSelection";
import { GameService } from "./game.service";
import { SocketHelper } from "./game.socket.helper";
import { GameReconciliationService } from "./game.reconciliation.service";
import { IMenuInit } from "./interfaces/msg.interfaces";

export interface    IGameResultData {
    aNick: string;
    bNick: string;
    aCategory: string,
    bCategory: string,
    aScore: number;
    bScore: number;
    aAvatar: string;
    bAvatar: string;
}

@Injectable()
export class    GameUpdateService {

    games: Map<string, Game>;
    gameSelections: Map<string, GameSelection>;
    updateInterval: NodeJS.Timer = undefined;
    pointTimeout: NodeJS.Timeout = undefined;

    static readonly updateTimeInterval: number = 1000 / 20;
    static readonly clientUpdateTimeInterval: number = 1000 / 60;

    constructor(
        private readonly gameService: GameService,
        private readonly socketHelper: SocketHelper,
        private readonly reconciliationService: GameReconciliationService
    ) {
        this.games = new Map<string, Game>();
        this.gameSelections = new Map<string, GameSelection>;
    }

    private getGameSelection(roomId: string): GameSelection {
        return (this.gameSelections.get(roomId));
    }

    private getGame(roomId: string): Game {
        const   game: Game = this.games.get(roomId);

        if (!game
            || game.state != GameState.Running)
            return (undefined);
        return (game);
    }

    getGameSelectionData(roomId: string): IGameSelectionData {
        const   gameSelection: GameSelection = this.getGameSelection(roomId);

        if (gameSelection
                && gameSelection.status != SelectionStatus.Canceled)
            return (gameSelection.data);
        return (undefined);
    }

    getGameClientStartData(roomId: string): IGameClientStart {
        const   game: Game = this.getGame(roomId);
    
        if (game)
            return (game.clientStartData());
        return (undefined);
    }

    getGameResult(roomId: string): IGameResultData | undefined {
        const   game: Game | undefined = this.games.get(roomId);
        const   players : [UserEntity, UserEntity] | undefined =
                    this.gameService.getPlayers(roomId);

        if (!game
                || game.state != GameState.Finished
                || !players
                || !players[0]
                || !players[1])
            return (undefined);
        return (
            this.buildResultData(
                [{...players[0]}, {...players[1]}],
                game.getResult()
            )
        );
    }

    getClientInitData(roomId: string)
                        : [string, IMenuInit |
                                    IGameClientStart |
                                    IGameResultData |
                                    undefined] {
        let data: IGameSelectionData | IGameClientStart |
                    IGameResultData | undefined = undefined;

        data = this.getGameSelectionData(roomId);
        if (data)
        {
            return (["newGame", {
                role: "Spectator",
                selection: data
            } as IMenuInit]);
        }
        data = this.getGameClientStartData(roomId);
        if (data)
            return (["startMatch", data]);
        data = this.getGameResult(roomId);
        if (data)
            return (["end", data]);
        return (["", undefined]);
    }

    attemptGameInit(roomId: string): void {
        if (!this.gameSelections.get(roomId)
                && !this.games.get(roomId))
            this.startGame(roomId);
    }

    //input: 0 === left, 1 === right, 2 === confirm 
    selectionInput(roomId: string, player: string,
                    input: number): IGameSelectionData {
        const   gameSelection: GameSelection = this.getGameSelection(roomId);
    
        if (!gameSelection)
            return (undefined);
        if (input === 0)
            gameSelection.nextLeft(player);
        else if (input === 1)
            gameSelection.nextRight(player);
        else
            gameSelection.confirm(player);
        return (gameSelection.data);
    }

    attemptSelectionFinish(roomId: string): void {
        const   gameSelection: GameSelection = this.getGameSelection(roomId);

        if (gameSelection
            && gameSelection.finished)
        {
            setTimeout(() => {
                //Checks for canceled gameSelection
                if (!gameSelection
                        || !gameSelection.finished)
                    return ;
                this.startMatch(roomId, gameSelection.data);
                this.gameSelections.delete(roomId);
            }, 3000);
        }
    }

    paddleInput(roomId: string, player: string,
                    up: boolean, when: number): void {
        const   game: Game = this.getGame(roomId);
    
        if (!game)
            return ;
        game.addInput({
            paddle: true,
            playerA: player === "PlayerA",
            up: up,
            when: when
        }); 
    }

    heroInput(roomId: string, player: string,
                up: boolean, when: number): void {
        const   game: Game = this.getGame(roomId);
    
        if (!game)
            return ;
        game.addInput({
            paddle: false,
            playerA: player === "PlayerA",
            up: up,
            when: when
        });
    }

    private checkPointCancel(data: IGameData): boolean {
        return (data.ball.xVel != 0
                    && this.pointTimeout != undefined);
    }

    private gameTransition(gameId: string): void {
        setTimeout(() => {
            this.gameSelections.delete(gameId);
            this.games.delete(gameId);
            this.manageUpdateInterval();
            this.startGame(gameId);
        }, 10000);
    }

    private buildResultData(players: [UserEntity, UserEntity],
                                result: IGameResult): IGameResultData {
        return ({
            aNick: players[0].nickName,
            bNick: players[1].nickName,
            aCategory: GameSelection.stringifyCategory(players[0].category),
            bCategory: GameSelection.stringifyCategory(players[1].category),
            aScore: players[0].nickName === result.winnerNick
                        ? result.winnerScore : result.loserScore,
            bScore: players[1].nickName === result.winnerNick
                        ? result.winnerScore : result.loserScore,
            aAvatar: players[0].photoUrl,
            bAvatar: players[1].photoUrl
        });
    }

    private gameEnd(gameId: string, gameResult: IGameResult): void {
        const   players : [UserEntity, UserEntity] =
                            this.gameService.getPlayers(gameId);
        
        if (gameResult.winnerNick === "")
        { // For cancelled games because of lag
            gameResult.winnerNick = players[0].nickName;
            gameResult.loserNick = players[1].nickName;
        }
        this.socketHelper.emitToRoom(
            gameId,
            "end",
            this.buildResultData(players, gameResult)
        );
        this.gameService.endGame(gameId, gameResult);
        this.socketHelper.clearRoom(`${gameId}-PlayerA`);
        this.socketHelper.clearRoom(`${gameId}-PlayerB`);
        this.gameTransition(gameId);
    }

    private pointTransition(game: Game, gameId: string): void {
        this.pointTimeout = setTimeout(() => {
            if (game.isFinished())
            {
                this.gameEnd(gameId, game.getResult());
                return ;
            }
            else if (game.state != GameState.Terminated)
                game.serveBall();
            this.pointTimeout = undefined;
        }, 5000);
    }

    private gameUpdate(game: Game, room: string): void {
        const   updateResult: GameUpdateResult = game.update();
        let     gameData: IGameData;
    
        if (updateResult === GameUpdateResult.Lag)
        {
            if (game.state === GameState.Finished)
                return ;
            game.state = GameState.Terminated;
            this.gameEnd(room, {
                winnerNick: "",
                loserNick: "",
                winnerScore: 0,
                loserScore: 0,
            });
            return ;
        }
        if (updateResult === GameUpdateResult.Point)
        { // A player scored
            if (!this.pointTimeout)
                this.pointTransition(game, room);
        }
        gameData = game.data();
        if (this.checkPointCancel(gameData))
        {
            clearTimeout(this.pointTimeout);
            this.pointTimeout = undefined;
        }
        this.socketHelper.emitToRoom(room, 'matchUpdate', game.data());
    }

    private manageUpdateInterval(): void {
        if (this.updateInterval === undefined
                && this.games.size === 1) {
            this.updateInterval = setInterval(() => {
                    this.games.forEach(
                        (gameElem, room) => {
                            if (gameElem.state === GameState.Running)
                                this.gameUpdate(gameElem, room);
                        }
                    );
                },
                GameUpdateService.updateTimeInterval
            );
        }
        else if (this.updateInterval
                    && this.games.size === 0)
        {
            clearInterval(this.updateInterval);
            this.updateInterval = undefined
        }
    }

    private scheduleClassicMatchStart(gameId: string): void {
        const   gameSelection: GameSelection =
                                    this.getGameSelection(gameId);
        
        setTimeout(() => {
            if (!gameSelection
                    || gameSelection.status === SelectionStatus.Canceled)
                return ;
            gameSelection.status = SelectionStatus.Finished;
            this.attemptSelectionFinish(gameId);
        }, 8000);
    }

    private sendSelectionData(hero: boolean, role: string,
                                selectionData: IGameSelectionData,
                                roomId: string): void {
        this.socketHelper.emitToRoom(roomId, "newGame", {
            hero: hero,
            role: role,
            selection: selectionData
        });
    }


    private async prepareClients(gameId: string, gameType: GameType,
                                    players: [UserEntity, UserEntity],
                                    selectionData: IGameSelectionData)
                                    : Promise<void> {
        let     playerRoom: string;
        const   gameHero = gameType === "hero";

        playerRoom = `${gameId}-PlayerA`;
        await this.socketHelper.addUserToRoom(players[0].username, playerRoom);
        this.sendSelectionData(gameHero, "PlayerA", selectionData, playerRoom);
        this.socketHelper.emitToRoom(playerRoom, "unqueue");
        playerRoom = `${gameId}-PlayerB`;
        await this.socketHelper.addUserToRoom(players[1].username, playerRoom);
        this.sendSelectionData(gameHero, "PlayerB", selectionData, playerRoom);
        this.socketHelper.emitToRoom(playerRoom, "unqueue");
        this.sendSelectionData(gameHero, "Spectator", selectionData, gameId);
    }

    private async startGame(gameId: string): Promise<void> {
        let gameSelection: GameSelection;
        let selectionData: IGameSelectionData;
        let [players, gameType]: [[UserEntity, UserEntity], GameType] =
                                    this.gameService.startGame(gameId);
        
        if (!players[0] || !players[1])
            return ;
        if (this.gameSelections.get(gameId) != undefined)
            this.gameSelections.delete(gameId);
        gameSelection = this.gameSelections.set(gameId, new GameSelection({
            nickPlayerA: players[0].username,
            nickPlayerB: players[1].username,
            categoryA: players[0].category,
            categoryB: players[1].category,
            avatarA: players[0].photoUrl,
            avatarB: players[1].photoUrl
        }, gameType === "hero")).get(gameId);
        selectionData = gameSelection.data;
        await this.prepareClients(gameId, gameType, players, selectionData);
        if (gameType === "classic")
            this.scheduleClassicMatchStart(gameId);
    }

    private createGame(gameId: string,
                        gameSelectionData: IGameSelectionData): Game {
        let game : Game;

        game = new Game(gameSelectionData, this.reconciliationService);
        this.games.set(gameId, game);
        return (game);
    }

    private startMatch(gameId: string,
                        gameSelectionData: IGameSelectionData): void {
        let game: Game;
    
        if (this.games.get(gameId) != undefined)
            this.games.delete(gameId);
        game = this.createGame(gameId, gameSelectionData);
        this.socketHelper.emitToRoom(
            gameId, "startMatch",
            game.clientStartData()
        );
        this.pointTransition(game, gameId);
        this.manageUpdateInterval();
    }

    playerWithdrawal(roomId: string, playerRoomId: string): void {
        const   gameSelection: GameSelection = this.getGameSelection(roomId);
        const   game: Game = this.getGame(roomId);
        const   winner: number = playerRoomId[playerRoomId.length - 1] === 'A'
                                    ? 1 : 0;

        if (
            (!gameSelection && !game)
            || (game && game.state != GameState.Running)
        )
            return ;
        if (game)
        {
            game.state = GameState.Terminated;
            game.forceWin(winner);
            this.gameEnd(roomId, game.getResult());
            return ;
        }
        gameSelection.status = SelectionStatus.Canceled;
        this.gameEnd(roomId, {
            winnerNick: winner === 0 ? gameSelection.data.nickPlayerA
                                        : gameSelection.data.nickPlayerB,
            loserNick: winner != 0 ? gameSelection.data.nickPlayerA
                                        : gameSelection.data.nickPlayerB,
            winnerScore: Game.getWinScore(),
            loserScore: 0,
        });
    }

}
