"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hero = void 0;
class Hero {
    constructor(initData) {
        this._name = initData.name;
        this._isActing = false;
        this._pointInvocation = false;
        this._activeSprite = -1;
        this._hitBall = false;
        this._upperSprite = initData.upperSprite;
        this._lowerSprite = initData.lowerSprite;
        this._playerSide = initData.playerSide;
        this._horizontalEndUpdate = initData.playerSide ? this.rightEndUpdate
            : this.leftEndUpdate;
    }
    get name() {
        return (this._name);
    }
    get isActing() {
        return (this._isActing);
    }
    get pointInvocation() {
        return (this._pointInvocation);
    }
    invocation(button) {
        if (this._pointInvocation != false)
            return;
        this._isActing = true;
        this._pointInvocation = true;
        this._activeSprite = button != 0
            ? 1 : 0;
    }
    getActiveSprite() {
        if (this._activeSprite === -1)
            return (undefined);
        return (this._activeSprite != 0
            ? this._upperSprite : this._lowerSprite);
    }
    leftEndUpdate(xDisplacement, xPos, xPosEnd) {
        return (xPos + xDisplacement >= xPosEnd);
    }
    rightEndUpdate(xDisplacement, xPos, xPosEnd) {
        return (xPos + xDisplacement <= xPosEnd);
    }
    upEndUpdate(yDisplacement, yPos, yPosEnd) {
        return (yPos + yDisplacement >= yPosEnd);
    }
    downEndUpdate(yDisplacement, yPos, yPosEnd) {
        return (yPos + yDisplacement <= yPosEnd);
    }
    verticalEndUpdate(yDisplacement, yPos, yPosEnd) {
        if (this._activeSprite === 0)
            return (this.downEndUpdate(yDisplacement, yPos, yPosEnd));
        return (this.upEndUpdate(yDisplacement, yPos, yPosEnd));
    }
    updateSprite(seconds, sprite) {
        const xDisplacement = seconds * sprite.xVelocity;
        const yDisplacement = seconds * sprite.yVelocity;
        if (this._horizontalEndUpdate(xDisplacement, sprite.xPos, sprite.xPosEnd)
            && this.verticalEndUpdate(yDisplacement, sprite.yPos, sprite.yPosEnd)) {
            sprite.xPos = sprite.xPosEnd;
            sprite.yPos = sprite.yPosEnd;
        }
        else {
            sprite.xPos += xDisplacement;
            sprite.yPos += yDisplacement;
        }
    }
    ballVelocityAfterHit() {
        const sprite = this.getActiveSprite();
        return ([sprite.xVelocity, sprite.yVelocity]);
    }
    checkBallHit(ballXPosition, ballYPosition, ballRadius) {
        const sprite = this.getActiveSprite();
        let ballSpriteXDist;
        let ballSpriteYDist;
        if (!sprite)
            return (undefined);
        ballSpriteXDist = Math.abs(ballXPosition - sprite.xPos);
        ballSpriteYDist = Math.abs(ballYPosition - sprite.yPos);
        if (this._hitBall === false
            && ballSpriteXDist - ballRadius <= sprite.radius
            && ballSpriteYDist - ballRadius <= sprite.radius) {
            this._hitBall = true;
            return (this.ballVelocityAfterHit());
        }
        return (undefined);
    }
    endAction(sprite) {
        this._isActing = false;
        sprite.xPos = sprite.xPosInit;
        sprite.yPos = sprite.yPosInit;
        this._activeSprite = -1;
        this._hitBall = false;
        this._pointInvocation = false;
    }
    checkEnd() {
        let sprite;
        if (this._activeSprite === -1)
            return;
        sprite = this._activeSprite != 0
            ? this._upperSprite : this._lowerSprite;
        if (sprite.xPos === sprite.xPosEnd
            && sprite.yPos === sprite.yPosEnd)
            this.endAction(sprite);
    }
    update(seconds) {
        let sprite;
        if (this._activeSprite === -1)
            return;
        sprite = this._activeSprite != 0
            ? this._upperSprite : this._lowerSprite;
        this.updateSprite(seconds, sprite);
    }
    data() {
        return ({
            xPos: this._upperSprite.xPos,
            yPos: this._upperSprite.yPos,
            lowXPos: this._lowerSprite.xPos,
            lowYPos: this._lowerSprite.yPos,
            activeSprite: this._activeSprite,
            active: true
        });
    }
    clientStartData() {
        return ({
            playerSide: this._playerSide,
            name: this._name,
            xPos: this._upperSprite.xPos,
            yPos: this._upperSprite.yPos,
            lowXPos: this._lowerSprite.xPos,
            lowYPos: this._lowerSprite.yPos,
            xOrigin: this._upperSprite.xOrigin,
            yOrigin: this._upperSprite.yOrigin,
            lowXOrigin: this._lowerSprite.xOrigin,
            lowYOrigin: this._lowerSprite.yOrigin
        });
    }
}
exports.Hero = Hero;
//# sourceMappingURL=Hero.js.map