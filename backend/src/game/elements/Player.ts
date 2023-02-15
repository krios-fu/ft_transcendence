import {
    Hero,
    IHeroClientStart,
    IHeroData,
    IHeroPhysicsData
} from "./Hero";
import {
    IPaddleClientStart,
    IPaddleInit,
    Paddle
} from "./Paddle";

export interface    IPlayerInit {
    paddle: IPaddleInit;
    score: number;
    nick: string;
    hero?: Hero; //0: Aquaman, 1: BlackPanther, 2: Superman
}

export interface    IPlayerClientStart {
    paddle: IPaddleClientStart;
    hero?: IHeroClientStart;
    score: number;
    nick: string;
}

export interface    IPlayerData {
    paddleY: number;
    hero?: IHeroData;
    score: number;
}

export interface    IPlayerPhysicsData {
    paddleY: number;
    hero?: IHeroPhysicsData;
    score: number;
}

export class    Player {

    private _paddle: Paddle;
    private _hero?: Hero;
    private _score: number;
    private _nick: string;

    constructor(init: IPlayerInit) {
        this._paddle = new Paddle(init.paddle);
        if (init.hero)
            this._hero = init.hero;
        this._score = init.score;
        this._nick = init.nick;
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

    mimic(data: IPlayerData): void {
        this._paddle.yPos = data.paddleY;
        this._score = data.score;
        if (this._hero && data.hero)
            this._hero.mimic(data.hero);
    }

    data(): IPlayerData {
        return ({
            paddleY: this._paddle.yPos,
            hero: this.hero ? this._hero.data() : undefined,
            score: this._score
        });
    }

    clientStartData(): IPlayerClientStart {
        return ({
            paddle: this._paddle.clientStartData(),
            hero: this.hero ? this._hero.clientStartData() : undefined,
            score: this._score,
            nick: this._nick
        });
    }

}
