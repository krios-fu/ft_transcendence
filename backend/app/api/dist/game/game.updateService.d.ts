/// <reference types="node" />
import { Server } from "socket.io";
import { Game, IGameClientStart } from "./elements/Game";
import { GameSelection, IGameSelectionData } from "./elements/GameSelection";
import { GameService } from "./game.service";
import { SocketHelper } from "./game.socket.helper";
export declare class GameUpdateService {
    private readonly gameService;
    private readonly socketHelper;
    server: Server;
    games: Map<string, Game>;
    gameSelections: Map<string, GameSelection>;
    updateInterval: NodeJS.Timer;
    constructor(gameService: GameService, socketHelper: SocketHelper);
    initServer(socketServer: Server): void;
    private getGameSelection;
    private getGame;
    getGameSelectionData(roomId: string): IGameSelectionData;
    getGameClientStartData(roomId: any): IGameClientStart;
    attemptGameInit(roomId: string): void;
    selectionInput(roomId: string, player: string, input: number): IGameSelectionData;
    attemptSelectionFinish(roomId: string): void;
    paddleInput(roomId: string, player: string, move: number): void;
    heroInput(roomId: string, player: string, move: number): void;
    private gameTransition;
    private gameEnd;
    private pointTransition;
    private gameUpdate;
    private manageUpdateInterval;
    private sendSelectionData;
    private startGame;
    private startMatch;
    playerWithdrawal(roomId: string, playerRoomId: string): void;
}
