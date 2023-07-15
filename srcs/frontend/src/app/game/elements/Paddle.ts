import * as Phaser from 'phaser'
import { MatchScene } from '../scenes/MatchScene';

export interface    IPaddleInitData {
    xPos: number;
    yPos: number;
    width: number;
    height: number;
    color: number;
    displacement: number;
}

export class    Paddle {

    private _paddle: Phaser.GameObjects.Rectangle;
    private _paddleShadow: Phaser.GameObjects.Rectangle;

    private static _displacement: number;
    private static _halfHeight: number;

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
        Paddle._displacement = initData.displacement;
        Paddle._halfHeight = initData.height / 2;
    }

    get xPos(): number {
        return (this._paddle.x);
    }

    get yPos(): number {
        return (this._paddle.y);
    }

    static  moveUp(paddleY: number): number {
        let result: number;
    
        if (paddleY - this._displacement < this._halfHeight)
            result = this._halfHeight;
        else
            result = paddleY - this._displacement;
        return (result);
    }

    static  moveDown(paddleY: number, gameHeight: number): number {
        let result: number;
    
        if (paddleY + this._displacement > gameHeight - this._halfHeight)
            result = gameHeight - this._halfHeight;
        else
            result = paddleY + this._displacement;
        return (result);
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
