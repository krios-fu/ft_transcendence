import { MatchScene } from "../scenes/MatchScene";

/*
**  The sprite's action area is represented by
**  an invisible circle that moves at a specific velocity
**  from a specific initial position towards a specific end
**  position of the game area following a straight line.
*/
export interface   IHeroSprite {
    xPosInit: number;
    yPosInit: number;
    xPosEnd: number;
    yPosEnd: number;
    xPos: number;
    yPos: number;
    radius: number;
    xVelocity: number;
    yVelocity: number;
    xOrigin: number; //For Phaser sprite origin
    yOrigin: number; //For Phaser sprite origin
    ballVelocityX: number; //Velocity of the ball after hero hit
    ballVelocityY: number; //Velocity of the ball after hero hit
}

export interface    IHeroInitData {
    playerSide: number; //0: left, 1: right
    name: string; // aquaman, blackPanther, superman
    sprite: IHeroSprite;
    spriteLow: IHeroSprite;
    active: number; //0: inactive, 1: lower, 2: upper
}

export interface    IHeroData {
    xPos: number;
    yPos: number;
    lowXPos: number;
    lowYPos: number;
    active: number; //0: inactive, 1: lower, 2: upper
}

export class    Hero {
    protected _upperSprite: Phaser.GameObjects.Sprite;
    protected _lowerSprite: Phaser.GameObjects.Sprite;
    protected _active: number;

    constructor(scene: MatchScene, initData: IHeroInitData) {
        this._upperSprite = scene.add.sprite(
            initData.sprite.xPos,
            initData.sprite.yPos,
            initData.name
        );
        this._lowerSprite = scene.add.sprite(
            initData.spriteLow.xPos,
            initData.spriteLow.yPos,
            initData.name
        );
        this._upperSprite.setOrigin(
            initData.sprite.xOrigin,
            initData.sprite.yOrigin
        );
        this._lowerSprite.setOrigin(
            initData.spriteLow.xOrigin,
            initData.spriteLow.yOrigin
        );
        this._active = initData.active;
    }

    get data(): IHeroData {
        return ({
            xPos: this._upperSprite.x,
            yPos: this._upperSprite.y,
            lowXPos: this._lowerSprite.x,
            lowYPos: this._lowerSprite.y,
            active: this._active
        });
    }

    update(data: IHeroData): void {
        this._upperSprite.x = data.xPos;
        this._upperSprite.y = data.yPos;
        this._lowerSprite.x = data.lowXPos;
        this._lowerSprite.y = data.lowYPos;
        this._active = data.active;
    }

    destroy(): void {
        this._lowerSprite.destroy();
        this._upperSprite.destroy();
    }

}
