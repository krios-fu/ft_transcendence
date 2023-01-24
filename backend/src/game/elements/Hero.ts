import {
    Circle,
    timeCirclesCollision
} from "../utils/Circle";
import { Vector } from "../utils/Vector";
import { IBallData } from "./Ball";

export interface    IHeroData {
    xPos: number;
    yPos: number;
    lowXPos: number;
    lowYPos: number;
    active: number; //0: inactive, 1: lower, 2: upper
    pointInvocation: boolean;
}

export interface    IHeroClientStart {
    playerSide: number;
    name: string;
    sprite: ISprite;
    spriteLow: ISprite;
    active: number; //0: inactive, 1: lower, 2: upper
    pointInvocation: boolean;
}

export interface    IHeroInit {
    name: string;
    upperSprite: ISprite;
    lowerSprite: ISprite;
    playerSide: number;
}

/*
**  The sprite's action area is represented by
**  an invisible circle that moves at a specific velocity
**  from a specific initial position towards a specific end
**  position of the game area following a straight line.
*/
export interface   ISprite {
    xPosInit: number;
    yPosInit: number;
    xPosEnd: number;
    yPosEnd: number;
    xPos: number;
    yPos: number;
    radius: number;
    xVelocity: number;
    yVelocity: number;
    xOrigin: number; //For client sprite origin
    yOrigin: number; //For client sprite origin
    ballVelocityX: number; //Velocity of the ball after hero hit
    ballVelocityY: number; //Velocity of the ball after hero hit
}

export class    Hero {

    private _name: string;
    private _pointInvocation: boolean;
    private _activeSprite: number; //0: inactive, 1: lower, 2: upper
    private _upperSprite: ISprite;
    private _lowerSprite: ISprite;
    private _playerSide: number; //0: left, 1: right
    private _horizontalEndUpdate: (xDisplacement: number, xPos: number,
                            xPosEnd: number) => boolean;

    constructor(initData: IHeroInit) {
        this._name = initData.name;
        this._pointInvocation = false;
        this._activeSprite = 0;
        this._upperSprite = initData.upperSprite;
        this._lowerSprite = initData.lowerSprite;
        this._playerSide = initData.playerSide;
        // Selects a function at runtime
        this._horizontalEndUpdate = initData.playerSide ? this.rightEndUpdate
                                            : this.leftEndUpdate;
    }

    get name(): string {
        return (this._name);
    }

    get isActing(): boolean {
        return (this._activeSprite != 0);
    }

    get pointInvocation(): boolean {
        return (this._pointInvocation);
    }

    /*
    **  up === true = W click
    **  up === false = S click
    */
    invocation(up: boolean): void {
        if (this.isActing
            || this._pointInvocation)
            return ;
        this._pointInvocation = true;
        this._activeSprite = up ? 2 : 1;
    }

    private getActiveSprite(): ISprite {
        if (!this._activeSprite)
            return (undefined);
        return (this._activeSprite === 2
                    ? this._upperSprite : this._lowerSprite);
    }

    private leftEndUpdate(xDisplacement: number, xPos: number,
                                xPosEnd: number): boolean {
        return (xPos + xDisplacement >= xPosEnd);
    }

    private rightEndUpdate(xDisplacement: number, xPos: number,
                                xPosEnd: number): boolean {
        return (xPos + xDisplacement <= xPosEnd);
    }

    private upEndUpdate(yDisplacement: number, yPos: number,
                            yPosEnd: number): boolean {
        return (yPos + yDisplacement >= yPosEnd);
    }

    private downEndUpdate(yDisplacement: number, yPos: number,
                            yPosEnd: number): boolean {
        return (yPos + yDisplacement <= yPosEnd);
    }

    private verticalEndUpdate(yDisplacement: number, yPos: number,
        yPosEnd: number)
    {
        if (this._activeSprite === 1)
            return (this.downEndUpdate(yDisplacement, yPos, yPosEnd));
        return (this.upEndUpdate(yDisplacement, yPos, yPosEnd));
    }

    private updateSprite(seconds: number, sprite: ISprite): void {
        const   xDisplacement = seconds * sprite.xVelocity;
        const   yDisplacement = seconds * sprite.yVelocity;    
    
        if (this._horizontalEndUpdate(xDisplacement, sprite.xPos,
                sprite.xPosEnd)
            && this.verticalEndUpdate(yDisplacement, sprite.yPos,
                sprite.yPosEnd))
        {
            sprite.xPos = sprite.xPosEnd;
            sprite.yPos = sprite.yPosEnd;
        }
        else
        {
            sprite.xPos += xDisplacement;
            sprite.yPos += yDisplacement;
        }
    }

    private ballHitBounce(posNoCollision: number, posCollision: number,
                            pastVelocity: number, newVelocity: number): number {
        const   posDiff = posNoCollision - posCollision;
    
        //Rule of three
        return ((newVelocity * posDiff) / pastVelocity);
    }

    private ballVelocityAfterHit(): [number, number] {
        const   sprite: ISprite = this.getActiveSprite();

        return ([sprite.ballVelocityX, sprite.ballVelocityY]);
    }

    private ballStateAfterHit(collisionTime: number, totalTime: number,
                                ball: Circle): IBallData {
        const   xPosCollision = ball.pos.x + (collisionTime * ball.vel.x);
        const   yPosCollision = ball.pos.y + (collisionTime * ball.vel.y);
        const   xPosNoCollision = ball.pos.x + (totalTime * ball.vel.x);
        const   yPosNoCollision = ball.pos.y + (totalTime * ball.vel.y);
        const   ballVelocity = this.ballVelocityAfterHit();

        return ({
            xPos: xPosCollision
                    + this.ballHitBounce(xPosNoCollision, xPosCollision,
                                            ball.vel.x, ballVelocity[0]),
            yPos: yPosCollision
                    + this.ballHitBounce(yPosNoCollision, yPosCollision,
                                            ball.vel.y, ballVelocity[1]),
            xVel: ballVelocity[0],
            yVel: ballVelocity[1]
        });
    }

    /*
    **  If true, the collision happened during the time of this update.
    **  Otherwise, the collision happens in the future.
    */
    private checkValidCollisionTime(collisionTime: number,
                                        maxTime: number): boolean {
        if (collisionTime <= maxTime)
            return (true);
        return (false);
    }

    private hitBall(ball: Circle, sprite: ISprite): boolean {
        if (ball.vel.x
            && (ball.vel.x === sprite.ballVelocityX
                && ball.vel.y === sprite.ballVelocityY)
        )
            return (true);
        return (false);
    }

    checkBallHit(ball: Circle, secondsElapsed: number): IBallData {
        const   sprite: ISprite = this.getActiveSprite();
        let     collision: [boolean, number];
    
        if (!sprite || this.hitBall(ball, sprite))
            return (undefined);
        collision = timeCirclesCollision({
            pos: new Vector(sprite.xPos, sprite.yPos),
            vel: new Vector(sprite.xVelocity, sprite.yVelocity),
            radius: sprite.radius
        }, ball);
        if (collision[0]
                && this.checkValidCollisionTime(collision[1], secondsElapsed))
            return (this.ballStateAfterHit(collision[1], secondsElapsed, ball));
        return (undefined);
    }

    private endAction(sprite: ISprite): void {
        sprite.xPos = sprite.xPosInit;
        sprite.yPos = sprite.yPosInit;
        this._activeSprite = 0;
        this._pointInvocation = false; // For testing
    }

    private checkEnd(sprite: ISprite): void {    
        if (!sprite)
            return ;
        if (sprite.xPos === sprite.xPosEnd
            && sprite.yPos === sprite.yPosEnd)
            this.endAction(sprite);
    }

    update(seconds: number): void {
        let sprite: ISprite;
    
        if (!this._activeSprite)
            return ;
        sprite = this._activeSprite === 2
                    ? this._upperSprite : this._lowerSprite;
        this.updateSprite(seconds, sprite);
        this.checkEnd(sprite);
    }

    data(): IHeroData {
        return ({
            xPos: this._upperSprite.xPos,
            yPos: this._upperSprite.yPos,
            lowXPos: this._lowerSprite.xPos,
            lowYPos: this._lowerSprite.yPos,
            active: this._activeSprite,
            pointInvocation: this._pointInvocation
        });
    }

    clientStartData(): IHeroClientStart {
        return ({
            playerSide: this._playerSide,
            name: this._name,
            sprite: this._upperSprite,
            spriteLow: this._lowerSprite,
            active: this._activeSprite,
            pointInvocation: this._pointInvocation
        });
    }

}
