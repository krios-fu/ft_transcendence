import {
    Hero,
    IHeroClientStart,
    IHeroData
} from "./Hero";
import {
    IPaddleClientStart,
    IPaddleData,
    IPaddleInit,
    Paddle
} from "./Paddle";

export interface    IPlayerInit {
    paddle: IPaddleInit;
    score: number;
    nick: string;
    hero: Hero; //0: Aquaman, 1: BlackPanther, 2: Superman
    gameWidth: number;
    gameHeight: number;
}

export interface    IPlayerClientStart {
    paddle: IPaddleClientStart;
    hero: IHeroClientStart;
    score: number;
    nick: string;
}

export interface    IPlayerData {
    paddle: IPaddleData;
    hero: IHeroData;
    score: number;
}

export class    Player {

    private _paddle: Paddle;
    private _hero: Hero;
    private _score: number;
    private _nick: string;
    private _paddleMoves: number[]; //0: down, 1: up
    private _heroInvocation: number;

    constructor(init: IPlayerInit) {
        this._paddle = new Paddle(init.paddle);
        this._hero = init.hero;
        this._score = init.score;
        this._nick = init.nick;
        this._paddleMoves = [];
        this._heroInvocation = -1;
    }

    get score(): number {
        return (this._score);
    }

    get nick(): string {
        return (this._nick);
    }

    get paddle(): Paddle {
        return (this._paddle);
    }

    get hero(): Hero {
        return (this._hero);
    }

    set score(input: number) {
        this._score = input;
    }

    addPaddleMove(move: number): void {
        if (move != 0 && move != 1)
            return ;
        this._paddleMoves.push(move);
    }

    //0: S, 1: W
    addHeroInvocation(invocation: number): void {
        if (invocation != 0 && invocation != 1)
            return ;
        this._heroInvocation = invocation;
    }

    update(seconds: number, gameHeight: number): void {
        if (this._heroInvocation != -1)
        {
            this._hero.invocation(this._heroInvocation);
            this._heroInvocation = -1;
        }
        this._hero.update(seconds);
        this._paddle.update(this._paddleMoves, gameHeight);
        this._paddleMoves = [];
    }

    checkHeroEnd(): void {
        this._hero.checkEnd();
    }

    data(): IPlayerData {
        return ({
            paddle: this._paddle.data(),
            hero: this._hero.data(),
            score: this._score
        });
    }

    clientStartData(): IPlayerClientStart {
        return ({
            paddle: this._paddle.clientStartData(),
            hero: this._hero.clientStartData(),
            score: this._score,
            nick: this._nick
        });
    }

}
