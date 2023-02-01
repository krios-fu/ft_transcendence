import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import { UserEntity } from "src/user/entities/user.entity";
import {
    Game,
    GameState,
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

@Injectable()
export class    GameUpdateService {

    server: Server;
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

    initServer(socketServer: Server): void {
        this.server = socketServer;
    }

    private getGameSelection(roomId: string): GameSelection {
        const   gameSelection: GameSelection = this.gameSelections.get(roomId);

        return (gameSelection);
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

        if (gameSelection)
            return (gameSelection.data);
        return (undefined);
    }

    getGameClientStartData(roomId): IGameClientStart {
        const   game: Game = this.getGame(roomId);
    
        if (game)
            return (game.clientStartData());
        return (undefined);
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
            this.startMatch(roomId, gameSelection.data);
            this.gameSelections.delete(roomId);
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

    private gameEnd(gameId: string, gameResult: IGameResult): void {
        const   players : [UserEntity, UserEntity] =
                            this.gameService.getPlayers(gameId);
        
        if (gameResult.winnerNick === "")
        { // For cancelled games because of lag
            gameResult.winnerNick = players[0].nickName;
            gameResult.loserNick = players[1].nickName;
        }
        this.socketHelper.emitToRoom(this.server, gameId, "end", {
            aNick: players[0].nickName,
            bNick: players[1].nickName,
            aCategory: GameSelection.stringifyCategory(players[0].category),
            bCategory: GameSelection.stringifyCategory(players[1].category),
            aScore: players[0].nickName === gameResult.winnerNick
                        ? gameResult.winnerScore : gameResult.loserScore,
            bScore: players[1].nickName === gameResult.winnerNick
                        ? gameResult.winnerScore : gameResult.loserScore,
            aAvatar: players[0].photoUrl,
            bAvatar: players[1].photoUrl
        });
        this.gameService.endGame(gameId, gameResult);
        this.socketHelper.clearRoom(this.server, `${gameId}-PlayerA`);
        this.socketHelper.clearRoom(this.server, `${gameId}-PlayerB`);
        this.gameTransition(gameId);
    }

    private pointTransition(game: Game, gameId: string): void {
        this.pointTimeout = setTimeout(() => {
            if (game.isFinished())
            {
                this.gameEnd(gameId, game.getResult());
                return ;
            }
            else
            {
                game.serveBall();
                this.socketHelper.emitToRoom(this.server, gameId, "served");
            }
            this.pointTimeout = undefined;
        }, 3000);
    }

    private gameUpdate(game: Game, room: string): void {
        const   updateResult: GameUpdateResult = game.update();
        let     gameData: IGameData;
    
        if (updateResult === GameUpdateResult.Lag)
        {
            if (game.state === GameState.Finished)
                return ;
            game.state = GameState.Finished;
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
        this.server.to(room).emit('matchUpdate', game.data());
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
        setTimeout(() => {
            const   gameSelection: GameSelection =
                                    this.gameSelections.get(gameId);
            if (!gameSelection)
                return ;
            gameSelection.status = SelectionStatus.Finished;
            this.attemptSelectionFinish(gameId);
        }, 8000);
    }

    private sendSelectionData(hero: boolean, role: string,
                                selectionData: IGameSelectionData,
                                roomId: string): void {
        this.socketHelper.emitToRoom(this.server, roomId, "newGame", {
            hero: hero,
            role: role,
            selection: selectionData
        });
    }

    private async prepareClients(gameId: string, gameType: number,
                                    players: [UserEntity, UserEntity],
                                    selectionData: IGameSelectionData)
                                    : Promise<void> {
        let     playerRoom: string;
        const   gameHero = gameType != 0;

        playerRoom = `${gameId}-PlayerA`;
        await this.socketHelper.addUserToRoom(this.server,
                        players[0].username, playerRoom);
        this.sendSelectionData(gameHero, "PlayerA", selectionData, playerRoom);
        playerRoom = `${gameId}-PlayerB`;
        await this.socketHelper.addUserToRoom(this.server,
                        players[1].username, playerRoom);
        this.sendSelectionData(gameHero, "PlayerB", selectionData, playerRoom);
        this.sendSelectionData(gameHero, "Spectator", selectionData, gameId);
}

    private async startGame(gameId: string): Promise<void> {
        let gameSelection: GameSelection;
        let selectionData: IGameSelectionData;
        let [players, gameType]: [[UserEntity, UserEntity], number] =
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
        })).get(gameId);
        selectionData = gameSelection.data;
        await this.prepareClients(gameId, gameType, players, selectionData);
        if (gameType === 0)
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
        this.socketHelper.emitToRoom(this.server, gameId,
                                        "startMatch", game.clientStartData());
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
            game.state = GameState.Finished;
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
