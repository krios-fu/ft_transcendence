import * as Phaser from 'phaser'
import { MatchScene } from '../scenes/MatchScene';

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

    constructor(scene: MatchScene, initData: IBallInitData) {
        this._ball = scene.add.ellipse(
            initData.xPos,
            initData.yPos,
            initData.width,
            initData.height,
            initData.color
        );
    }

    get xPos(): number {
        return (this._ball.x);
    }

    get yPos(): number {
        return (this._ball.y);
    }

    update(data: IBallData): void {
        this._ball.x = data.xPos;
        this._ball.y = data.yPos;
    }

    destroy(): void {
        this._ball.destroy();
    }

}
