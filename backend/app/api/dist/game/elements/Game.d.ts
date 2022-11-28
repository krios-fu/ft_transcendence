import { IPlayerClientStart, IPlayerData } from './Player';
import { IBallClientStart, IBallData } from './Ball';
import { IGameSelectionData } from './GameSelection';
export declare enum GameState {
    Running = 0,
    Paused = 1,
    Finished = 2
}
export interface IGameClientStart {
    playerA: IPlayerClientStart;
    playerB: IPlayerClientStart;
    ball: IBallClientStart;
}
export interface IGameData {
    playerA: IPlayerData;
    playerB: IPlayerData;
    ball: IBallData;
}
export interface IGameResult {
    winnerNick: string;
    loserNick: string;
    winnerScore: number;
    loserScore: number;
}
export declare class Game {
    private _width;
    private _height;
    private _playerA;
    private _playerB;
    private _ball;
    private _lastUpdate;
    private _state;
    private static winScore;
    constructor(gameSelection: IGameSelectionData);
    get state(): GameState;
    set state(input: GameState);
    static getWinScore(): number;
    isFinished(): boolean;
    serveBall(): void;
    forceWin(winner: number): void;
    checkWin(player: number): boolean;
    getWinnerNick(): string;
    getResult(): IGameResult;
    private deltaTime;
    private checkBorderCollision;
    private ballUpdate;
    addPaddleAMove(move: number): void;
    addPaddleBMove(move: number): void;
    addHeroAInvocation(invocation: number): void;
    addHeroBInvocation(invocation: number): void;
    update(): boolean;
    data(): IGameData;
    clientStartData(): IGameClientStart;
}
