import * as Phaser from 'phaser'
import { MatchScene } from '../scenes/MatchScene';

export interface    IPaddleInitData {
    xPos: number;
    yPos: number;
    width: number;
    height: number;
    color: number;
}

export class    Paddle {

    private _paddle: Phaser.GameObjects.Rectangle;
    private _paddleShadow: Phaser.GameObjects.Rectangle;

    constructor(scene: MatchScene, initData: IPaddleInitData) {
        this._paddle = scene.add.rectangle(
            initData.xPos,
            initData.yPos,
            initData.width,
            initData.height,
            initData.color
        );
        this._paddleShadow = scene.add.rectangle(
            initData.xPos,
            initData.yPos,
            initData.width + 10,
            initData.height + 10,
            0x000000
        );
        this._paddle.depth = 1;
        this._paddleShadow.depth = 0;
    }

    get xPos(): number {
        return (this._paddle.x);
    }

    get yPos(): number {
        return (this._paddle.y);
    }

    update(yPos: number): void {
        this._paddle.y = yPos;
        this._paddleShadow.y = yPos;
    }

    destroy(): void {
        this._paddle.destroy();
        this._paddleShadow.destroy();
    }

}
