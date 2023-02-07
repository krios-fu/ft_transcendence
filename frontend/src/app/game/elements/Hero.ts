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
    pointInvocation: boolean;
}

export interface    IHeroData {
    xPos: number;
    yPos: number;
    lowXPos: number;
    lowYPos: number;
    active: number; //0: inactive, 1: lower, 2: upper
    pointInvocation: boolean;
}

export abstract class    Hero {
    protected _upperSprite: Phaser.GameObjects.Sprite;
    protected _lowerSprite: Phaser.GameObjects.Sprite;
    private   _data: IHeroData;

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
        this._upperSprite.alpha = 0;
        this._lowerSprite.alpha = 0;
        this._data = {
            xPos: initData.sprite.xPos,
            yPos: initData.sprite.yPos,
            lowXPos: initData.spriteLow.xPos,
            lowYPos: initData.spriteLow.yPos,
            active: initData.active,
            pointInvocation: initData.pointInvocation
        };
    }

    get data(): IHeroData {
        return ({...this._data});
    }

    private _updateRenderPosition(heroSprite: Phaser.GameObjects.Sprite,
                                    upper: boolean): void {
        heroSprite.x = upper ? this._data.xPos : this._data.lowXPos;
        heroSprite.y = upper ? this._data.yPos : this._data.lowYPos;
    }

    private _getActiveRenderHero()
                : [Phaser.GameObjects.Sprite | undefined, boolean] {
        if (this._upperSprite.x != this._data.xPos
                    || this._upperSprite.y != this._data.yPos)
            return ([this._upperSprite, true]);
        if (this._lowerSprite.x != this._data.lowXPos
                    || this._lowerSprite.y != this._data.lowYPos)
            return ([this._lowerSprite, false]);
        return ([undefined, false]);
    }

    private _render(): void {
        const   [targetHero, upper]
                    : [Phaser.GameObjects.Sprite | undefined, boolean] =
                        this._getActiveRenderHero();
    
        if (!targetHero)
            return ;
        if (this._data.active)
        {
            if (targetHero.alpha === 0)
            {
                this._shout();
                targetHero.alpha = 1;
            }
            this._updateRenderPosition(targetHero, upper);
        }
        else
        {
            if (targetHero.alpha > 0)
                targetHero.alpha -= 0.01;
            else
                this._updateRenderPosition(targetHero, upper);
        }
    }

    protected abstract _shout(): void;

    update(data: IHeroData): void {
        this._data = {...data};
        this._render();
    }

    destroy(): void {
        this._lowerSprite.destroy();
        this._upperSprite.destroy();
    }

}
