import { MatchScene } from "../scenes/MatchScene";

export interface    IHeroInitData {
    playerSide: number; //0: left, 1: right
    xPos: number;
    yPos: number;
    xOrigin: number;
    yOrigin: number;
    name: string; // aquaman, blackPanther, superman
    lowXPos: number;
    lowYPos: number;
    lowXOrigin: number;
    lowYOrigin: number;
}

export interface    IHeroData {
    xPos: number;
    yPos: number;
    lowXPos: number;
    lowYPos: number;
}

export class    Hero {
    protected _upperSprite: Phaser.GameObjects.Sprite;
    protected _lowerSprite: Phaser.GameObjects.Sprite;

    constructor(scene: MatchScene, initData: IHeroInitData) {
        this._upperSprite = scene.add.sprite(
            initData.xPos,
            initData.yPos,
            initData.name
        );
        this._lowerSprite = scene.add.sprite(
            initData.lowXPos,
            initData.lowYPos,
            initData.name
        );
        this._upperSprite.setOrigin(initData.xOrigin, initData.yOrigin);
        this._lowerSprite.setOrigin(initData.lowXOrigin, initData.lowYOrigin);
    }

    update(data: IHeroData): void {
        this._upperSprite.x = data.xPos;
        this._upperSprite.y = data.yPos;
        this._lowerSprite.x = data.lowXPos;
        this._lowerSprite.y = data.lowYPos;
    }

    destroy(): void {
        this._lowerSprite.destroy();
        this._upperSprite.destroy();
    }

}
