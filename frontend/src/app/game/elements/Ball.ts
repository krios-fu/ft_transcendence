import * as Phaser from 'phaser'
import { MatchScene } from '../scenes/MatchScene';
import {
    MatchOtherSoundKeys,
    SoundService
} from '../services/sound.service';

export interface    IBallInitData {
    xPos: number;
    yPos: number;
    xVel: number;
    yVel: number;
    width: number;
    height: number;
    color: number;
}

export interface    IBallData {
    xPos: number;
    yPos: number;
    xVel: number;
    yVel: number;
}

export class    Ball {

    private _ball: Phaser.GameObjects.Ellipse;
    private _ballShadow: Phaser.GameObjects.Ellipse;
    private _xVel: number;
    private _yVel: number;
    private _soundKeys: MatchOtherSoundKeys;

    constructor(scene: MatchScene, initData: IBallInitData,
                    private readonly soundService?: SoundService) {
        this._ball = scene.add.ellipse(
            initData.xPos,
            initData.yPos,
            initData.width,
            initData.height,
            initData.color
        );
        this._ballShadow = scene.add.ellipse(
            initData.xPos,
            initData.yPos,
            initData.width + 10,
            initData.height + 10,
            0x000000
        );
        this._ball.depth = 1;
        this._ballShadow.depth = 0;
        this._xVel = initData.xVel;
        this._yVel = initData.yVel;
        this._soundKeys = SoundService.matchOtherSoundKeys;
    }

    get xPos(): number {
        return (this._ball.x);
    }

    get yPos(): number {
        return (this._ball.y);
    }

    get data(): IBallData {
        return ({
            xPos: this.xPos,
            yPos: this.yPos,
            xVel: this._xVel,
            yVel: this._yVel
        });
    }

    private _playSound(data: IBallData): void {
        if (!this.soundService
                || data.xVel === this._xVel)
            return ;
    
        if (data.xVel === 0)
            this.soundService.play(this._soundKeys.point, false);
        else if (this._xVel != 0)
            this.soundService.play(this._soundKeys.collision, false);
    }

    update(data: IBallData): void {
        this._playSound(data);
        this._ball.x = data.xPos;
        this._ball.y = data.yPos;
        this._ballShadow.x = data.xPos;
        this._ballShadow.y = data.yPos;
        this._xVel = data.xVel;
        this._yVel = data.yVel;
    }

    destroy(): void {
        this._ball.destroy();
        this._ballShadow.destroy();
    }

}
