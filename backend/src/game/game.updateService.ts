import { Injectable } from "@nestjs/common";
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
import {
    GameDataService,
    Players,
    RunningGame
} from "./game.data.service";
import {
    EventEmitter2,
    OnEvent
} from '@nestjs/event-emitter';

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

    private _updateInterval: NodeJS.Timer;

    static readonly updateTimeInterval: number = 1000 / 20;
    static readonly clientUpdateTimeInterval: number = 1000 / 60;

    constructor(
        private readonly gameService: GameService,
        private readonly gameDataService: GameDataService,
        private readonly socketHelper: SocketHelper,
        private readonly reconciliationService: GameReconciliationService,
        private eventEmitter: EventEmitter2
    ) {
        this._updateInterval = undefined;
    }

    @OnEvent('game.start')
    handleGameStartEvent(gameId: string) {
        const   gameType: GameType | undefined =
                        this.gameDataService.getType(gameId);
        
        if (!gameType)
            return ;
        this.startGame(gameId, gameType);
    }

    getGameSelectionData(roomId: string): IGameSelectionData {
        const   gameSelection: GameSelection =
                            this.gameDataService.getSelection(roomId);

        if (gameSelection
                && gameSelection.status != SelectionStatus.Canceled)
            return (gameSelection.data);
        return (undefined);
    }

    getGameClientStartData(roomId: string): IGameClientStart {
        const   game: Game = this.gameDataService.getGame(roomId);
    
        if (game
                && (game.state === GameState.Running
                        || (game.state === GameState.Finished
                                && !this.getGameResult(roomId))))
            return (game.clientStartData());
        return (undefined);
    }

    getGameResult(roomId: string): IGameResultData | undefined {
        return (this.gameDataService.getResult(roomId));
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

    //input: 0 === left, 1 === right, 2 === confirm 
    selectionInput(roomId: string, player: string,
                    input: number): IGameSelectionData {
        const   gameSelection: GameSelection =
                            this.gameDataService.getSelection(roomId);
    
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
        const   gameSelection: GameSelection =
                            this.gameDataService.getSelection(roomId);

        if (gameSelection
            && gameSelection.finished)
        {
            //It does't matter if it was already cleared
            if (gameSelection.heroMenuTimeoutDate)
                gameSelection.clearHeroMenuTimeout();
            setTimeout(() => {
                //Checks for canceled gameSelection
                if (!gameSelection
                        || !gameSelection.finished)
                    return ;
                this.startMatch(roomId, gameSelection.data);
                this.gameDataService.setSelection(roomId, undefined);
            }, 3000);
        }
    }

    paddleInput(roomId: string, player: string,
                    up: boolean, when: number): void {
        const   game: Game = this.gameDataService.getGame(roomId);
    
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
        const   game: Game = this.gameDataService.getGame(roomId);
    
        if (!game)
            return ;
        game.addInput({
            paddle: false,
            playerA: player === "PlayerA",
            up: up,
            when: when
        });
    }

    private checkPointCancel(gameId: string, data: IGameData): boolean {
        return (
            data.ball.xVel != 0
                && this.gameDataService.getPointTimeout(gameId) != undefined
        );
    }

    private gameTransition(gameId: string): void {
        setTimeout(() => {
            this.gameDataService.removeGameData(gameId);
            this.manageUpdateInterval();
            this.eventEmitter.emit('game.ended', gameId);
        }, 10000);
    }

    private buildResultData(players: Players,
                                result: IGameResult): IGameResultData {
        return ({
            aNick: players.a.nickName,
            bNick: players.b.nickName,
            aCategory: GameSelection.stringifyCategory(players.a.category),
            bCategory: GameSelection.stringifyCategory(players.b.category),
            aScore: players.a.nickName === result.winnerNick
                        ? result.winnerScore : result.loserScore,
            bScore: players.b.nickName === result.winnerNick
                        ? result.winnerScore : result.loserScore,
            aAvatar: players.a.photoUrl,
            bAvatar: players.b.photoUrl
        });
    }

    private async gameEnd(gameId: string,
                            gameResult: IGameResult): Promise<void> {
        const   players : Players = this.gameDataService.getPlayers(gameId);
        
        if (gameResult.winnerNick === "")
        { // For cancelled games because of lag
            gameResult.winnerNick = players.a.nickName;
            gameResult.loserNick = players.b.nickName;
        }
        this.gameDataService.setResult(
            gameId,
            this.buildResultData(players, gameResult)
        );
        this.socketHelper.emitToRoom(
            gameId,
            "end",
            this.gameDataService.getResult(gameId)
        );
        await this.gameService.endGame(gameId, gameResult);
        this.socketHelper.clearRoom(`${gameId}-PlayerA`);
        this.socketHelper.clearRoom(`${gameId}-PlayerB`);
        this.gameTransition(gameId);
    }

    private pointTransition(game: Game, gameId: string): void {
        this.gameDataService.setPointTimeout(gameId,
            setTimeout(() => {
                if (game.isFinished())
                {
                    this.gameEnd(gameId, game.getResult());
                    return ;
                }
                else if (game.state != GameState.Terminated)
                    game.serveBall();
                this.gameDataService.setPointTimeout(gameId, undefined);
            },
            5 * 1000)
        );
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
            if (!this.gameDataService.getPointTimeout(room))
                this.pointTransition(game, room);
        }
        gameData = game.data();
        if (this.checkPointCancel(room, gameData))
            this.gameDataService.clearPointTimeout(room);
        this.socketHelper.emitToRoom(room, 'matchUpdate', game.data());
    }

    private manageUpdateInterval(): void {
        const   runningGames: RunningGame[] =
                            this.gameDataService.getRunningGames();
    
        if (this._updateInterval === undefined
                && runningGames.length === 1) {
            this._updateInterval = setInterval(() => {
                    runningGames.forEach(
                        (elem) => {
                            if (elem.game.state === GameState.Running)
                                this.gameUpdate(elem.game, elem.id);
                        }
                    );
                },
                GameUpdateService.updateTimeInterval
            );
        }
        else if (this._updateInterval
                    && runningGames.length === 0)
        {
            clearInterval(this._updateInterval);
            this._updateInterval = undefined
        }
    }

    /*
    **  gameSelection.heroMenuTimeoutDate is higher than Date.now(), as it
    **  represents a future date.
    */
    private scheduleHeroMatchStart(gameId: string): void {
        const   gameSelection: GameSelection =
                            this.gameDataService.getSelection(gameId);
        
        gameSelection.heroMenuTimeout = setTimeout(() => {
            if (!gameSelection
                    || gameSelection.status === SelectionStatus.Canceled)
                return ;
            gameSelection.forceConfirm();
            this.attemptSelectionFinish(gameId);
        }, gameSelection.heroMenuTimeoutDate - Date.now());
    }

    private scheduleClassicMatchStart(gameId: string): void {
        const   gameSelection: GameSelection =
                            this.gameDataService.getSelection(gameId);
        
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
                                    players: Players,
                                    selectionData: IGameSelectionData)
                                    : Promise<void> {
        let     playerRoom: string;
        const   gameHero = gameType === "hero";

        playerRoom = `${gameId}-PlayerA`;
        await this.socketHelper.addUserToRoom(players.a.username, playerRoom);
        this.sendSelectionData(gameHero, "PlayerA", selectionData, playerRoom);
        this.socketHelper.emitToRoom(playerRoom, "unqueue");
        playerRoom = `${gameId}-PlayerB`;
        await this.socketHelper.addUserToRoom(players.b.username, playerRoom);
        this.sendSelectionData(gameHero, "PlayerB", selectionData, playerRoom);
        this.socketHelper.emitToRoom(playerRoom, "unqueue");
        this.sendSelectionData(gameHero, "Spectator", selectionData, gameId);
    }

    private async startGame(gameId: string, gameType: GameType): Promise<void> {
        let     gameSelection: GameSelection;
        let     selectionData: IGameSelectionData;
        const   players: Players = this.gameDataService.getPlayers(gameId);
        
        if (!players)
            return ;
        gameSelection = new GameSelection({
            nickPlayerA: players.a.username,
            nickPlayerB: players.b.username,
            categoryA: players.a.category,
            categoryB: players.b.category,
            avatarA: players.a.photoUrl,
            avatarB: players.b.photoUrl
        }, gameType === "hero");
        this.gameDataService.setSelection(gameId, gameSelection);
        selectionData = gameSelection.data;
        await this.prepareClients(gameId, gameType, players, selectionData);
        if (gameType === "classic")
            this.scheduleClassicMatchStart(gameId);
        else
            this.scheduleHeroMatchStart(gameId);
    }

    private startMatch(gameId: string,
                        gameSelectionData: IGameSelectionData): void {
        const   game: Game = new Game(
            gameSelectionData,
            this.reconciliationService
        );
    
        this.gameDataService.setGame(gameId, game);
        this.socketHelper.emitToRoom(
            gameId, "startMatch",
            game.clientStartData()
        );
        this.pointTransition(game, gameId);
        this.manageUpdateInterval();
    }

    async playerWithdrawal(roomId: string, playerRoomId: string): Promise<void> {
        const   gameSelection: GameSelection =
                            this.gameDataService.getSelection(roomId);
        const   game: Game = this.gameDataService.getGame(roomId);
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
            await this.gameEnd(roomId, game.getResult());
            return ;
        }
        gameSelection.status = SelectionStatus.Canceled;
        //It does't matter if it was already cleared
        if (gameSelection.heroMenuTimeoutDate)
                gameSelection.clearHeroMenuTimeout();
        await this.gameEnd(roomId, {
            winnerNick: winner === 0 ? gameSelection.data.nickPlayerA
                                        : gameSelection.data.nickPlayerB,
            loserNick: winner != 0 ? gameSelection.data.nickPlayerA
                                        : gameSelection.data.nickPlayerB,
            winnerScore: Game.getWinScore(),
            loserScore: 0,
        });
    }

}
