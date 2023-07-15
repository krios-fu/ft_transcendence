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
import { SoundService } from '../services/sound.service';

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

    constructor(scene: MatchScene, initData: IPlayerInitData,
                    private readonly soundService?: SoundService) {
        this._paddle = new Paddle(scene, initData.paddle);
        if (initData.hero && this.soundService)
        {
            if (initData.hero.name === "aquaman")
                this._hero = new Aquaman(scene, initData.hero,
                                            this.soundService);
            else if (initData.hero.name === "superman")
                this._hero = new Superman(scene, initData.hero,
                                            this.soundService);
            else
                this._hero = new BlackPanther(scene, initData.hero,
                                                this.soundService);
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

    get hero(): string | undefined {
        if (!this._hero)
            return (undefined);
        if (this._hero instanceof Aquaman)
            return ("aquaman");
        if (this._hero instanceof BlackPanther)
            return ("blackPanther");
        return ("superman");
    }

    set score(s: number) {
        this._score = s;
    }

    static initToData(data: IPlayerInitData): IPlayerData {
        return ({
            paddleY: data.paddle.yPos,
            hero: data.hero ? Hero.initToData(data.hero) : undefined,
            score: data.score
        })
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
