import { HeroId } from "./GameSelection";
import {
    Hero,
    ISprite
} from "./Hero";

export class    HeroCreator {

    private _gameWidth: number;
    private _gameHeight: number;

    constructor(gameWidth: number, gameHeight: number) {
        this._gameWidth = gameWidth;
        this._gameHeight = gameHeight;
    }

    private aquamanSprite(playerSide: number, upperSprite: boolean): ISprite {
        const   sprite: ISprite = {} as ISprite;

        sprite.radius = 20;
        if (playerSide === 0) //0: left, else: right
        {
            sprite.xPosInit = 80;
            sprite.yPosInit = upperSprite ? 0 : this._gameHeight;
            sprite.xPosEnd = 335;
            sprite.yPosEnd = upperSprite ? 255 : this._gameHeight - 255;
            sprite.xVelocity = 800;
            sprite.yVelocity = upperSprite ? 800 : -800;
            sprite.xOrigin = 1;
            sprite.yOrigin = upperSprite ? 1 : 0;
        }
        else
        {
            sprite.xPosInit = this._gameWidth - 80;
            sprite.yPosInit = upperSprite ? 0 : this._gameHeight;
            sprite.xPosEnd = 465;
            sprite.yPosEnd = upperSprite ? 255 : this._gameHeight - 255;
            sprite.xVelocity = -800;
            sprite.yVelocity = upperSprite ? 800 : -800;
            sprite.xOrigin = 0;
            sprite.yOrigin = upperSprite ? 1 : 0;
        }
        sprite.xPos = sprite.xPosInit;
        sprite.yPos = sprite.yPosInit;
        sprite.ballVelocityX = sprite.xVelocity;
        sprite.ballVelocityY = sprite.yVelocity;
        return (sprite);
    }

    private aquaman(playerSide: number): Hero {
        return (new Hero({
            name: 'aquaman',
            upperSprite: this.aquamanSprite(playerSide, true),
            lowerSprite: this.aquamanSprite(playerSide, false),
            playerSide: playerSide
        }));
    }

    private supermanSprite(playerSide: number, upperSprite: boolean): ISprite {
        const   sprite: ISprite = {} as ISprite;

        sprite.radius = 20;
        if (playerSide === 0) //0: left, else: right
        {
            sprite.xPosInit = 0;
            sprite.yPosInit = upperSprite ? this._gameHeight * 0.3
                                                : this._gameHeight * 0.6;
            sprite.xPosEnd = 335;
            sprite.yPosEnd = sprite.yPosInit;
            sprite.xVelocity = 800;
            sprite.yVelocity = 0;
            sprite.xOrigin = 1;
            sprite.yOrigin = 0;
        }
        else
        {
            sprite.xPosInit = this._gameWidth;
            sprite.yPosInit = upperSprite ? this._gameHeight * 0.35
                                                : this._gameHeight * 0.65;
            sprite.xPosEnd = 465;
            sprite.yPosEnd = sprite.yPosInit;
            sprite.xVelocity = -800;
            sprite.yVelocity = 0;
            sprite.xOrigin = 0;
            sprite.yOrigin = 0;
        }
        sprite.xPos = sprite.xPosInit;
        sprite.yPos = sprite.yPosInit;
        sprite.ballVelocityX = sprite.xVelocity;
        sprite.ballVelocityY = sprite.yVelocity;
        return (sprite);
    }

    private superman(playerSide: number): Hero {
        return (new Hero({
            name: 'superman',
            upperSprite: this.supermanSprite(playerSide, true),
            lowerSprite: this.supermanSprite(playerSide, false),
            playerSide: playerSide
        }));
    }

    private blackPantherSprite(playerSide: number,
                                upperSprite: boolean): ISprite {
        const   sprite: ISprite = {} as ISprite;

        sprite.radius = 20;
        if (upperSprite)
        {//playerSide (0: left, else: right)
            sprite.xPosInit = playerSide === 0 ? 200 : this._gameWidth - 200;
            sprite.yPosInit = 0 - sprite.radius;
            sprite.xVelocity = 0;
            sprite.yVelocity = 800;
            sprite.xOrigin = 0.5;
            sprite.yOrigin = 1;
            sprite.ballVelocityX = playerSide === 0 ? 300 : -300;
            sprite.ballVelocityY = sprite.yVelocity;
        }
        else
        {//playerSide (0: left, else: right)
            sprite.xPosInit = playerSide === 0 ? 200 : this._gameWidth - 200;
            sprite.yPosInit = this._gameHeight + sprite.radius;
            sprite.xVelocity = 0;
            sprite.yVelocity = -800;
            sprite.xOrigin = 0.5;
            sprite.yOrigin = 0;
            sprite.ballVelocityX = playerSide === 0 ? 300 : -300;
            sprite.ballVelocityY = sprite.yVelocity;
        }
        sprite.xPosEnd = sprite.xPosInit;
        sprite.yPosEnd = this._gameHeight * 0.5;
        sprite.xPos = sprite.xPosInit;
        sprite.yPos = sprite.yPosInit;
        return (sprite);
    }

    private blackPanther(playerSide: number): Hero {
        return (new Hero({
            name: 'blackPanther',
            upperSprite: this.blackPantherSprite(playerSide, true),
            lowerSprite: this.blackPantherSprite(playerSide, false),
            playerSide: playerSide
        }));
    }

    create(heroId: HeroId, playerSide: number): Hero {
        if (heroId === HeroId.Aquaman)
            return (this.aquaman(playerSide));
        if (heroId === HeroId.Superman)
            return (this.superman(playerSide));
        return (this.blackPanther(playerSide));
    }

}
