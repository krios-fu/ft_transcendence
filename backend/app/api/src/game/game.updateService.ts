import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import { UserEntity } from "src/user/user.entity";
import { Game, GameState, IGameClientStart } from "./elements/Game";
import { GameSelection, IGameSelectionData } from "./elements/GameSelection";
import { GameService } from "./game.service";
import { SocketHelper } from "./game.socket.helper";

@Injectable()
export class    GameUpdateService {

    server: Server;
    games: Map<string, Game>;
    gameSelections: Map<string, GameSelection>;
    updateInterval: NodeJS.Timer = undefined;

    constructor(
        private readonly gameService: GameService,
        private readonly socketHelper: SocketHelper,
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

        if (gameSelection.finished)
        {
            this.startMatch(roomId, gameSelection.data);
            this.gameSelections.delete(roomId);
        }
    }

    //move: 0 === Down, 1 === Up
    paddleInput(roomId: string, player: string, move: number): void {
        const   game: Game = this.getGame(roomId);
    
        if (!game)
            return ;
        if (player === "PlayerA")
            game.addPaddleAMove(move); 
        else
            game.addPaddleBMove(move);
    }

    //move: //0 === S, 1 === W
    heroInput(roomId: string, player: string, move: number): void {
        const   game: Game = this.getGame(roomId);
    
        if (!game)
            return ;
        if (player === "PlayerA")
            game.addHeroAInvocation(move);
        else
            game.addHeroBInvocation(move);
    }

    private gameTransition(gameId: string): void {
        setTimeout(() => {
            this.games.delete(gameId);
            this.manageUpdateInterval();
            this.startGame(gameId);
        }, 10000);
    }

    private gameEnd(gameId: string, game: Game): void {
        const   winnerNickname = game.getWinnerNick();
        
        this.socketHelper.emitToRoom(this.server, gameId, "end", {
            winner: winnerNickname
        });
        this.gameService.endGame(gameId, game);
        this.socketHelper.clearRoom(this.server, `${gameId}-PlayerA`);
        this.socketHelper.clearRoom(this.server, `${gameId}-PlayerB`);
        this.gameTransition(gameId);
    }

    private pointTransition(game: Game, gameId: string): void {
        setTimeout(() => {
            game.serveBall();
            this.socketHelper.emitToRoom(this.server, gameId, "served");
        }, 3000);
    }

    private gameUpdate(game: Game, room: string): void {
        if (game.update())
        { // A player scored
            if (game.getWinnerNick() != "")
            {
                game.pause();
                this.gameEnd(room, game);
                return ;
            }
            else
                this.pointTransition(game, room);
        }
        this.server.to(room).emit('matchUpdate', game.data());
    }

    private manageUpdateInterval(): void {
        if (this.updateInterval === undefined
                && this.games.size === 1) {
            this.updateInterval = setInterval(() => {
                    this.games.forEach(
                        (gameElem, room) => {
                            if (gameElem.state != GameState.Paused)
                                this.gameUpdate(gameElem, room);
                        }
                    );
                },
                16
            );
        }
        else if (this.updateInterval
                    && this.games.size === 0)
        {
            clearInterval(this.updateInterval);
            this.updateInterval = undefined
        }
    }

    private sendSelectionData(role: string, selectionData: IGameSelectionData,
                        roomId: string): void {
        this.socketHelper.emitToRoom(this.server, roomId, "newGame", {
            role: role,
            selection: selectionData
        });
    }

    private async startGame(gameId: string): Promise<void> {
        let gameSelection: GameSelection;
        let selectionData: IGameSelectionData;
        let playerRoom: string;
        let players: [UserEntity, UserEntity] =
            this.gameService.startGame(gameId);
        
        if (!players[0] || !players[1])
            return ;
        if (this.gameSelections.get(gameId) != undefined)
            this.gameSelections.delete(gameId);
        gameSelection = this.gameSelections.set(gameId, new GameSelection(
            players[0].username,
            players[1].username
        )).get(gameId);
        selectionData = gameSelection.data;
        playerRoom = `${gameId}-PlayerA`;
        await this.socketHelper.addUserToRoom(this.server,
                                            players[0].username, playerRoom);
        this.sendSelectionData("PlayerA", selectionData, playerRoom);
        playerRoom = `${gameId}-PlayerB`;
        await this.socketHelper.addUserToRoom(this.server,
                                            players[1].username, playerRoom);
        this.sendSelectionData("PlayerB", selectionData, playerRoom);
        this.sendSelectionData("Spectator", selectionData, gameId);
    }

    private startMatch(gameId: string,
                gameSelectionData: IGameSelectionData): void {
        let game: Game;
    
        if (this.games.get(gameId) != undefined)
            this.games.delete(gameId);
        game = this.games.set(gameId, new Game(
            gameSelectionData
        )).get(gameId);
        this.socketHelper.emitToRoom(this.server, gameId,
                            "startMatch", game.clientStartData());
        this.pointTransition(game, gameId);
        this.manageUpdateInterval();
    }

    playerWithdrawal(roomId: string, playerRoomId: string): void {
        const   gameSelection: GameSelection = this.getGameSelection(roomId);
        const   game: Game = this.getGame(roomId);
        let     winner: number;

        if (!game
            || game.state != GameState.Running)
            return ;
        game.pause();
        winner = playerRoomId[playerRoomId.length - 1] === 'A'
                    ? 1 : 0;
        game.forceWin(winner);
        this.gameEnd(roomId, game);
    }

}
