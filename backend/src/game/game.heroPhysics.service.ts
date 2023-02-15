import { Injectable } from "@nestjs/common";
import { IBallData } from "./elements/Ball";
import {
    Circle,
    timeCirclesCollision
} from "./utils/Circle";
import { Vector } from "./utils/Vector";
import {
    IHeroData,
    IHeroPhysicsData,
    ISprite
} from "./elements/Hero";

@Injectable()
export class    GameHeroPhysicsService {

    private _xPosition: number;
    private _yPosition: number;
    private _sprite: ISprite;

    constructor() {}

    private ballHitBounce(posNoCollision: number, posCollision: number,
                            pastVelocity: number, newVelocity: number): number {
        const   posDiff = posNoCollision - posCollision;

        //Rule of three
        return ((newVelocity * posDiff) / pastVelocity);
    }

    private _ballVelocityAfterHit(): [number, number] {
        return ([
            this._sprite.ballVelocityX,
            this._sprite.ballVelocityY
        ]);
    }

    private _ballStateAfterHit(collisionTime: number, totalTime: number,
                                ball: Circle): IBallData {
        const   xPosCollision = ball.pos.x + (collisionTime * ball.vel.x);
        const   yPosCollision = ball.pos.y + (collisionTime * ball.vel.y);
        const   xPosNoCollision = ball.pos.x + (totalTime * ball.vel.x);
        const   yPosNoCollision = ball.pos.y + (totalTime * ball.vel.y);
        const   ballVelocity = this._ballVelocityAfterHit();

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
    private _checkValidCollisionTime(collisionTime: number,
                                        maxTime: number): boolean {
        if (collisionTime <= maxTime)
            return (true);
        return (false);
    }

    private _hitBall(ball: Circle, sprite: ISprite): boolean {
        if (ball.vel.x
                && (ball.vel.x === sprite.ballVelocityX
                && ball.vel.y === sprite.ballVelocityY)
        )
            return (true);
        return (false);
    }

    private _getActiveSprite(data: IHeroPhysicsData): ISprite | undefined {
        if (!data.active)
            return (undefined);
        return (
            data.active === 2 ?
                data.hero : data.heroLow
        );
    }

    private _initSprite(sprite: ISprite): void {
        this._sprite = sprite;
    }

    checkBallHit(ball: Circle, hero: IHeroPhysicsData,
                    secondsElapsed: number): IBallData | undefined {
        const   sprite: ISprite | undefined = this._getActiveSprite(hero);
        let     collision: [boolean, number];

        if (!sprite || this._hitBall(ball, sprite))
            return (undefined);
        this._initSprite(sprite);
        collision = timeCirclesCollision({
            pos: new Vector(sprite.xPos, sprite.yPos),
            vel: new Vector(sprite.xVelocity, sprite.yVelocity),
            radius: sprite.radius
        }, ball);
        if (collision[0]
                && this._checkValidCollisionTime(collision[1], secondsElapsed))
            return (this._ballStateAfterHit(collision[1], secondsElapsed, ball));
        return (undefined);
    }

    private _fillHeroData(initData: IHeroPhysicsData,
                            activeUpdate: boolean): IHeroData {
        const   result: IHeroData = {} as IHeroData;
    
        result.pointInvocation = initData.pointInvocation;
        result.active = activeUpdate ? initData.active : 0;
        if (initData.active === 2)
        {
            result.xPos = this._xPosition;
            result.yPos = this._yPosition;
            result.lowXPos = initData.heroLow.xPos;
            result.lowYPos = initData.heroLow.yPos;
        }
        else if (initData.active === 1) {
            result.lowXPos = this._xPosition;
            result.lowYPos = this._yPosition;
            result.xPos = initData.hero.xPos;
            result.yPos = initData.hero.yPos;
        }
        else
        {
            result.xPos = initData.hero.xPos;
            result.yPos = initData.hero.yPos;
            result.lowXPos = initData.heroLow.xPos;
            result.lowYPos = initData.heroLow.yPos;
        }
        return (result);
    }

    private _checkEndPos(velocity: number,
                            currentPosition: number,
                            endPosition: number): boolean {
        if (velocity < 0)
        {
            if (currentPosition <= endPosition)
                return (true);
        }
        else if (velocity > 0)
        {
            if (currentPosition >= endPosition)
                return (true);
        }
        else
        {
            if (currentPosition === endPosition)
                return (true);
        }
        return (false);
    }

    private _updatePosition(secondsElapsed: number): boolean {
        this._xPosition += secondsElapsed * this._sprite.xVelocity;
        this._yPosition += secondsElapsed * this._sprite.yVelocity;

        if (this._checkEndPos(this._sprite.xVelocity, this._xPosition,
                                this._sprite.xPosEnd)
                && this._checkEndPos(this._sprite.yVelocity, this._yPosition,
                                        this._sprite.yPosEnd))
        {
            this._xPosition = this._sprite.xPosInit;
            this._yPosition = this._sprite.yPosInit;
            return (false);
        }
        return (true);
    }

    private _initPosition(sprite: ISprite): void {
        this._xPosition = sprite.xPos;
        this._yPosition = sprite.yPos;
    }

    update(hero: IHeroPhysicsData, secondsElapsed: number): IHeroData {
        const   sprite: ISprite | undefined = this._getActiveSprite(hero);
        let     active: boolean;

        if (!hero)
            return ({} as IHeroData);
        if (!sprite)
            return (this._fillHeroData(hero, false));
        this._initPosition(sprite);
        this._initSprite(sprite);
        active = this._updatePosition(secondsElapsed);
        return (this._fillHeroData(hero, active));
    }

}
