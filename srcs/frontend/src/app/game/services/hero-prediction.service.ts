import { Injectable } from "@angular/core";
import { Vector } from "../utils/Vector";
import { IBallData } from "../elements/Ball";
import {
    IHeroData,
    IHeroSprite
} from "../elements/Hero";
import {
    Circle,
    timeCirclesCollision
} from "../utils/Circle";

export interface    IHeroPredictionInit {
    aHeroSprite: IHeroSprite;
    aHeroSpriteLow: IHeroSprite;
    bHeroSprite: IHeroSprite;
    bHeroSpriteLow: IHeroSprite;
}

@Injectable({
    providedIn: 'root'
})
export class    HeroPredictionService {

    private _init: boolean;
    private _aHero: IHeroSprite;
    private _aHeroLow: IHeroSprite;
    private _bHero: IHeroSprite;
    private _bHeroLow: IHeroSprite;
    /*
    **  _xPos and _yPos are:
    **  Temporary values for each call indicating
    **  the incoming hero's current position.
    */
    private _xPos: number;
    private _yPos: number;

    private static _aHeroEndX: number = 0;
    private static _bHeroEndX: number = 0;

    constructor() {
        this._init = false;
        this._aHero = {} as IHeroSprite;
        this._aHeroLow = {} as IHeroSprite;
        this._bHero = {} as IHeroSprite;
        this._bHeroLow = {} as IHeroSprite;
        this._xPos = 0;
        this._yPos = 0;
    }

    static get aHeroEndX(): number {
        return (this._aHeroEndX);
    }

    static get bHeroEndX(): number {
        return (this._bHeroEndX);
    }

    init(data: IHeroPredictionInit | undefined): void {
        if (!data)
        {
            this._init = false;
            return ;
        }
        this._init = true;
        this._aHero = {...data.aHeroSprite};
        this._aHeroLow = {...data.aHeroSpriteLow};
        this._bHero = {...data.bHeroSprite};
        this._bHeroLow = {...data.bHeroSpriteLow};
        HeroPredictionService._aHeroEndX = this._aHero.xPosEnd
                                            + this._aHero.radius;
        HeroPredictionService._bHeroEndX = this._bHero.xPosEnd
                                            - this._bHero.radius;
    }

    private _ballHitBounce(posNoCollision: number, posCollision: number,
                            pastVelocity: number, newVelocity: number): number {
        const   posDiff = posNoCollision - posCollision;

        //Rule of three
        return ((newVelocity * posDiff) / pastVelocity);
    }

    private _ballVelocityAfterHit(hero: IHeroSprite): [number, number] {
        return ([hero.ballVelocityX, hero.ballVelocityY]);
    }

    private _ballStateAfterHit(collisionTime: number, totalTime: number,
                                ball: Circle, hero: IHeroSprite): IBallData {
        const   xPosCollision = ball.pos.x + (collisionTime * ball.vel.x);
        const   yPosCollision = ball.pos.y + (collisionTime * ball.vel.y);
        const   xPosNoCollision = ball.pos.x + (totalTime * ball.vel.x);
        const   yPosNoCollision = ball.pos.y + (totalTime * ball.vel.y);
        const   ballVelocity = this._ballVelocityAfterHit(hero);

        return ({
            xPos: xPosCollision
                    + this._ballHitBounce(xPosNoCollision, xPosCollision,
                                            ball.vel.x, ballVelocity[0]),
            yPos: yPosCollision
                    + this._ballHitBounce(yPosNoCollision, yPosCollision,
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

    private _hitBall(hero: IHeroSprite, ball: Circle): boolean {
        if (ball.vel.x
            && (ball.vel.x === hero.ballVelocityX
                && ball.vel.y === hero.ballVelocityY)
        )
            return (true);
        return (false);
    }

    private _getHero(hero: IHeroData, aHero: boolean): IHeroSprite | undefined {
        if (!hero.active)
            return (undefined);
        if (hero.active === 1)
        {
            this._xPos = hero.lowXPos;
            this._yPos = hero.lowYPos;
            return (aHero ? this._aHeroLow : this._bHeroLow);
        }
        this._xPos = hero.xPos;
        this._yPos = hero.yPos;
        return (aHero ? this._aHero : this._bHero);
    }

    checkBallHit(ball: Circle, heroData: IHeroData, aHero: boolean,
                    secondsElapsed: number): IBallData | undefined {
        const   hero: IHeroSprite | undefined = this._getHero(heroData, aHero);
        let     collision: [boolean, number];
    
        if (!this._init || !hero || this._hitBall(hero, ball))
            return (undefined);
        collision = timeCirclesCollision({
            pos: new Vector(this._xPos, this._yPos),
            vel: new Vector(hero.xVelocity, hero.yVelocity),
            radius: hero.radius
        }, ball);
        if (collision[0]
            && this._checkValidCollisionTime(collision[1], secondsElapsed))
        {
            return (this._ballStateAfterHit(
                collision[1],
                secondsElapsed,
                ball,
                hero
            ));
        }
        return (undefined);
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

    private _updatePosition(hero: IHeroSprite,
                                secondsElapsed: number): boolean {
        this._xPos += secondsElapsed * hero.xVelocity;
        this._yPos += secondsElapsed * hero.yVelocity;

        if (this._checkEndPos(hero.xVelocity, this._xPos, hero.xPosEnd)
                && this._checkEndPos(hero.yVelocity, this._yPos, hero.yPosEnd))
        {
            this._xPos = hero.xPosInit;
            this._yPos = hero.yPosInit;
            return (false);
        }
        return (true);
    }

    move(heroData: IHeroData, aHero: boolean,
            secondsElapsed: number): IHeroData {
        const   hero: IHeroSprite | undefined = this._getHero(heroData, aHero);
        const   result: IHeroData = {...heroData};
        let     active: boolean;

        if (!this._init || !hero)
            return (result);
        active = this._updatePosition(hero, secondsElapsed);
        if (heroData.active === 1)
        {
            result.lowXPos = this._xPos;
            result.lowYPos = this._yPos;
        }
        else
        {
            result.xPos = this._xPos;
            result.yPos = this._yPos;
        }
        if (!active)
            result.active = 0;
        return (result);
    }

}
