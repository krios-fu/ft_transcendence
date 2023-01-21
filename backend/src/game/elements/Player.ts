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
    hero?: Hero; //0: Aquaman, 1: BlackPanther, 2: Superman
    gameWidth: number;
    gameHeight: number;
}

export interface    IPlayerClientStart {
    paddle: IPaddleClientStart;
    hero?: IHeroClientStart;
    score: number;
    nick: string;
}

export interface    IPlayerData {
    paddle: IPaddleData;
    hero?: IHeroData;
    score: number;
}

export class    Player {

    private _paddle: Paddle;
    private _hero?: Hero;
    private _score: number;
    private _nick: string;
    private _paddleMoves: number[]; //0: down, 1: up
    private _heroInvocation?: number;

    constructor(init: IPlayerInit) {
        this._paddle = new Paddle(init.paddle);
        if (init.hero)
        {
            this._hero = init.hero;
            this._heroInvocation = -1;
        }
        this._score = init.score;
        this._nick = init.nick;
        this._paddleMoves = [];
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

    //1: Down, 2: Up
    addPaddleMove(move: number): void {
        if (move != 1 && move != 2)
            return ;
        this._paddleMoves.push(move - 1); //Convert to 0: Down, 1: Up
    }

    //1: S, 2: W
    addHeroInvocation(invocation: number): void {
        if (!this._hero
            || (invocation != 1 && invocation != 2))
            return ;
        this._heroInvocation = invocation - 1; //Convert to 0: S, 1: W
    }

    updatePaddle(gameHeight: number): void {
        this._paddle.update(this._paddleMoves, gameHeight);
        this._paddleMoves = [];
    }

    processHeroInvocation(): void {
        if (this._hero)
        {
            if (this._heroInvocation != -1)
            {
                this._hero.invocation(this._heroInvocation);
                this._heroInvocation = -1;
            }
        }
    }

    updateHero(seconds: number): void {
        if (this._hero)
            this._hero.update(seconds);
    }

    data(): IPlayerData {
        return ({
            paddle: this._paddle.data(),
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
