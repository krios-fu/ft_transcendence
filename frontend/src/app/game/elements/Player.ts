import { MatchScene } from '../scenes/MatchScene';
import { Aquaman } from './Aquaman';
import { BlackPanther } from './BlackPanther';
import { Superman } from './Superman';
import {
    Hero,
    IHeroData,
    IHeroInitData
} from './Hero';
import {
    Paddle,
    IPaddleInitData
} from './Paddle';

export interface    IPlayerInitData {
    paddle: IPaddleInitData;
    hero?: IHeroInitData;
    score: number;
    nick: string;
}

export interface    IPlayerData {
    paddleY: number,
    hero?: IHeroData,
    score: number
}

export class    Player {

    private _paddle: Paddle;
    private _hero?: Hero;
    private _score: number;
    private _nick: string;

    constructor(scene: MatchScene, initData: IPlayerInitData) {
        this._paddle = new Paddle(scene, initData.paddle);
        if (initData.hero)
        {
            if (initData.hero.name === "aquaman")
                this._hero = new Aquaman(scene, initData.hero);
            else if (initData.hero.name === "superman")
                this._hero = new Superman(scene, initData.hero);
            else
                this._hero = new BlackPanther(scene, initData.hero);
        }
        this._score = initData.score;
        this._nick = initData.nick;
    }

    get data(): IPlayerData {
        return ({
            paddleY: this._paddle.yPos,
            hero: this._hero ? this._hero.data : undefined,
            score: this._score
        });
    }

    get score(): number {
        return (this._score);
    }

    get nick(): string {
        return (this._nick);
    }

    set score(s: number) {
        this._score = s;
    }

    update(data: IPlayerData): void {
        this._paddle.update(data.paddleY);
        if (data.hero && this._hero)
            this._hero.update(data.hero);
        this._score = data.score;
    }

    destroy(): void {
        this._paddle.destroy();
        if (this._hero)
            this._hero.destroy();
    }

}
