"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroCreator = void 0;
const BlackPanther_1 = require("./BlackPanther");
const GameSelection_1 = require("./GameSelection");
const Hero_1 = require("./Hero");
class HeroCreator {
    constructor(gameWidth, gameHeight) {
        this._gameWidth = gameWidth;
        this._gameHeight = gameHeight;
    }
    aquamanSprite(playerSide, upperSprite) {
        const sprite = {};
        sprite.radius = 20;
        if (playerSide === 0) {
            sprite.xPosInit = 80;
            sprite.yPosInit = upperSprite ? 0 : this._gameHeight;
            sprite.xPosEnd = 335;
            sprite.yPosEnd = upperSprite ? 255 : this._gameHeight - 255;
            sprite.xVelocity = 800;
            sprite.yVelocity = upperSprite ? 800 : -800;
            sprite.xOrigin = 1;
            sprite.yOrigin = upperSprite ? 1 : 0;
        }
        else {
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
        return (sprite);
    }
    aquaman(playerSide) {
        return (new Hero_1.Hero({
            name: 'aquaman',
            upperSprite: this.aquamanSprite(playerSide, true),
            lowerSprite: this.aquamanSprite(playerSide, false),
            playerSide: playerSide
        }));
    }
    supermanSprite(playerSide, upperSprite) {
        const sprite = {};
        sprite.radius = 20;
        if (playerSide === 0) {
            sprite.xPosInit = 0;
            sprite.yPosInit = upperSprite ? this._gameHeight * 0.25
                : this._gameHeight * 0.75;
            sprite.xPosEnd = 335;
            sprite.yPosEnd = sprite.yPosInit;
            sprite.xVelocity = 800;
            sprite.yVelocity = 0;
            sprite.xOrigin = 1;
            sprite.yOrigin = 0.5;
        }
        else {
            sprite.xPosInit = this._gameWidth;
            sprite.yPosInit = upperSprite ? this._gameHeight * 0.25
                : this._gameHeight * 0.75;
            sprite.xPosEnd = 465;
            sprite.yPosEnd = sprite.yPosInit;
            sprite.xVelocity = -800;
            sprite.yVelocity = 0;
            sprite.xOrigin = 0;
            sprite.yOrigin = 0.5;
        }
        sprite.xPos = sprite.xPosInit;
        sprite.yPos = sprite.yPosInit;
        return (sprite);
    }
    superman(playerSide) {
        return (new Hero_1.Hero({
            name: 'superman',
            upperSprite: this.supermanSprite(playerSide, true),
            lowerSprite: this.supermanSprite(playerSide, false),
            playerSide: playerSide
        }));
    }
    blackPantherSprite(playerSide, upperSprite) {
        const sprite = {};
        sprite.radius = 20;
        if (upperSprite) {
            sprite.xPosInit = playerSide === 0 ? 200 : this._gameWidth - 200;
            sprite.yPosInit = 0 - sprite.radius;
            sprite.xVelocity = 0;
            sprite.yVelocity = 800;
            sprite.xOrigin = 0.5;
            sprite.yOrigin = 1;
        }
        else {
            sprite.xPosInit = playerSide === 0 ? 200 : this._gameWidth - 200;
            sprite.yPosInit = this._gameHeight + sprite.radius;
            sprite.xVelocity = 0;
            sprite.yVelocity = -800;
            sprite.xOrigin = 0.5;
            sprite.yOrigin = 0;
        }
        sprite.xPosEnd = sprite.xPosInit;
        sprite.yPosEnd = this._gameHeight * 0.5;
        sprite.xPos = sprite.xPosInit;
        sprite.yPos = sprite.yPosInit;
        return (sprite);
    }
    blackPanther(playerSide) {
        return (new BlackPanther_1.BlackPanther({
            name: 'blackPanther',
            upperSprite: this.blackPantherSprite(playerSide, true),
            lowerSprite: this.blackPantherSprite(playerSide, false),
            playerSide: playerSide
        }));
    }
    create(heroId, playerSide) {
        if (heroId === GameSelection_1.HeroId.None)
            return (this.aquaman(playerSide));
        if (heroId === GameSelection_1.HeroId.Aquaman)
            return (this.aquaman(playerSide));
        if (heroId === GameSelection_1.HeroId.Superman)
            return (this.superman(playerSide));
        return (this.blackPanther(playerSide));
    }
}
exports.HeroCreator = HeroCreator;
//# sourceMappingURL=HeroCreator.js.map