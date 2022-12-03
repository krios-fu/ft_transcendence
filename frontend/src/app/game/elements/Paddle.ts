import * as Phaser from 'phaser'
import { MatchScene } from '../scenes/MatchScene';

export interface    IPaddleInitData {
    xPos: number;
    yPos: number;
    width: number;
    height: number;
    color: number;
}

export interface    IPaddleData {
    xPos: number;
    yPos: number;
}

export class    Paddle {

    private _paddle: Phaser.GameObjects.Rectangle;

    constructor(scene: MatchScene, initData: IPaddleInitData) {
        this._paddle = scene.add.rectangle(
            initData.xPos,
            initData.yPos,
            initData.width,
            initData.height,
            initData.color
        );
    }

    get xPos(): number {
        return (this._paddle.x);
    }

    get yPos(): number {
        return (this._paddle.y);
    }

    update(data: IPaddleData): void {
        this._paddle.x = data.xPos;
        this._paddle.y = data.yPos;
    }

    destroy(): void {
        this._paddle.destroy();
    }

}
