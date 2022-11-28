import { Hero, IHeroClientStart, IHeroData } from "./Hero";
import { IPaddleClientStart, IPaddleData, IPaddleInit, Paddle } from "./Paddle";
export interface IPlayerInit {
    paddle: IPaddleInit;
    score: number;
    nick: string;
    hero: Hero;
    gameWidth: number;
    gameHeight: number;
}
export interface IPlayerClientStart {
    paddle: IPaddleClientStart;
    hero: IHeroClientStart;
    score: number;
    nick: string;
}
export interface IPlayerData {
    paddle: IPaddleData;
    hero: IHeroData;
    score: number;
}
export declare class Player {
    private _paddle;
    private _hero;
    private _score;
    private _nick;
    private _paddleMoves;
    private _heroInvocation;
    constructor(init: IPlayerInit);
    get score(): number;
    get nick(): string;
    get paddle(): Paddle;
    get hero(): Hero;
    set score(input: number);
    addPaddleMove(move: number): void;
    addHeroInvocation(invocation: number): void;
    update(seconds: number, gameHeight: number): void;
    checkHeroEnd(): void;
    data(): IPlayerData;
    clientStartData(): IPlayerClientStart;
}
