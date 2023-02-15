import { Injectable } from "@nestjs/common";
import { IBallData } from "./elements/Ball";
import { IGamePhysicsData } from "./elements/Game";
import { IHeroPhysicsData } from "./elements/Hero";
import { GameHeroPhysicsService } from "./game.heroPhysics.service";
import { gameMeasures } from "./utils/gameMeasures";
import { Vector } from "./utils/Vector";

@Injectable()
export class    GameBallPhysicsService {

    private _xPosition: number;
    private _yPosition: number;
    private _xVelocity: number;
    private _yVelocity: number;

    constructor(
        private readonly heroPhysicsService: GameHeroPhysicsService
    ) {
        this._xPosition = 0;
        this._yPosition = 0;
        this._xVelocity = 0;
        this._yVelocity = 0;
    }

    private _move(xDisplacement: number, yDisplacement: number): void {
        this._xPosition += xDisplacement;
        this._yPosition += yDisplacement;
    }

    private _paddleBounceX(xNoCollisionDest: number, prevVelocityX: number,
                            paddleBorder: number): number {
        const   bounceAmount: number = (xNoCollisionDest - paddleBorder) * -1;
        let     result: number = paddleBorder;

        if (prevVelocityX === this._xVelocity * -1)
            result += bounceAmount;
        else
        {
            // Rule of Three
            result += ((this._xVelocity * bounceAmount) / prevVelocityX) * -1;
        }
        return (result);
    }

    private _paddleBounceY(yDisplacement: number, prevVelocityY: number,
                            yIntersection: number): number {
        const   noCollisionDest: number = this._yPosition + yDisplacement;
        const   bounceAmount: number = noCollisionDest - yIntersection;
        let     result: number = yIntersection;

        // Rule of Three
        result += (this._yVelocity * bounceAmount) / prevVelocityY;
        return (result);
    }

    /*
    **  (paddleHitHeight / gameMeasures.paddleHeight) obtains percentage
    **      of total paddle height.
    **
    **  (* (ballHitVelocity * 2) - ballHitVelocity) relates
    **  paddle height percentage with ball
    **  velocity range (-ballHitVelocity - +ballHitVelocity).
    */
    private _collisionPaddleLeft(aPaddleY: number, yIntersection: number,
                                    xNoCollisionDest: number,
                                    yDisplacement: number): void {
        const   prevVelocityX = this._xVelocity;
        const   prevVelocityY = this._yVelocity;
        const   paddleHitHeight = yIntersection - aPaddleY
                                    + gameMeasures.paddleHalfHeight;

        this._xVelocity = gameMeasures.paddleHitVelocity;
        this._yVelocity = ((paddleHitHeight / gameMeasures.paddleHeight)
                            * (gameMeasures.paddleHitVelocity * 2))
                            - gameMeasures.paddleHitVelocity;
        this._xPosition = this._paddleBounceX(xNoCollisionDest, prevVelocityX,
                                                gameMeasures.aPaddleRightBorder)
                            + gameMeasures.ballRadius;
        this._yPosition = this._paddleBounceY(yDisplacement, prevVelocityY,
                                                yIntersection);
    }

    private _collisionPaddleRight(bPaddleY: number, yIntersection: number,
                                    xNoCollisionDest: number,
                                    yDisplacement: number): void {
        const   prevVelocityX = this._xVelocity;
        const   prevVelocityY = this._yVelocity;
        const   paddleHitHeight = yIntersection - bPaddleY
                                    + gameMeasures.paddleHalfHeight;

        this._xVelocity = gameMeasures.paddleHitVelocity;
        this._yVelocity = ((paddleHitHeight / gameMeasures.paddleHeight)
                            * (gameMeasures.paddleHitVelocity * 2))
                            - gameMeasures.paddleHitVelocity;
        this._xVelocity *= -1;
        this._xPosition = this._paddleBounceX(xNoCollisionDest, prevVelocityX,
                                                gameMeasures.bPaddleLeftBorder)
                            - gameMeasures.ballRadius;
        this._yPosition = this._paddleBounceY(yDisplacement, prevVelocityY,
                                                yIntersection);
    }

    private _collisionUp(xDisplacement: number,
                            yNoCollisionDest: number): void {
        this._xPosition += xDisplacement;
        this._yPosition = (yNoCollisionDest * -1) + gameMeasures.ballRadius;
        this._yVelocity *= -1;
    }

    private _collisionDown(gameHeight: number, xDisplacement: number,
                            yNoCollisionDest: number): void {
        this._xPosition += xDisplacement;
        this._yPosition = gameHeight - (yNoCollisionDest - gameHeight)
                            - gameMeasures.ballRadius;
        this._yVelocity *= -1;
    }

    private _collisionRight(gameWidth: number, gameHeight: number): void {
        this._xVelocity = 0;
        this._yVelocity = 0;
        this._xPosition = (gameWidth / 2) - gameMeasures.ballRadius;
        this._yPosition = (gameHeight / 2) - gameMeasures.ballRadius;
    }

    private _collisionLeft(gameWidth: number, gameHeight: number): void {
        this._xVelocity = 0;
        this._yVelocity = 0;
        this._xPosition = (gameWidth / 2) - gameMeasures.ballRadius;
        this._yPosition = (gameHeight / 2) - gameMeasures.ballRadius;
    }

    /*
    **  Returns y value of intersection between paddle's x axis
    **  and ball's trajectory line.
    */
    private _yIntersectionPaddle(paddleX: number, xDisplacement: number,
                                    yDisplacement: number): number {
        const   slope = yDisplacement / xDisplacement;

        return ((slope * (paddleX - this._xPosition)) + this._yPosition);
    }

    private _checkCollisionPaddleLeft(aPaddleY: number,
                                        ballXDisplacement: number,
                                        ballYDisplacement: number): boolean {
        const   ballLeftBorder = this._xPosition - gameMeasures.ballRadius;
        const   xNoCollisionDest = ballLeftBorder + ballXDisplacement;
        let     yIntersection: number;

        if (ballLeftBorder > gameMeasures.aPaddleRightBorder
                && xNoCollisionDest <= gameMeasures.aPaddleRightBorder)
        {
            yIntersection = this._yIntersectionPaddle(gameMeasures.aPaddleX,
                                                        ballXDisplacement,
                                                        ballYDisplacement);
            if (Math.abs(this._yPosition - aPaddleY)
                    <= gameMeasures.paddleHalfHeight + gameMeasures.ballRadius)
            {
                this._collisionPaddleLeft(aPaddleY, yIntersection,
                                            xNoCollisionDest,
                                            ballYDisplacement);
                return (true);
            }
        }
        return (false);
    }

    private _checkCollisionPaddleRight(bPaddleY: number,
                                        ballXDisplacement: number,
                                        ballYDisplacement: number): boolean {
        const   ballRightBorder = this._xPosition + gameMeasures.ballRadius;
        const   xNoCollisionDest = ballRightBorder + ballXDisplacement;
        let     yIntersection: number;

        if (ballRightBorder < gameMeasures.bPaddleLeftBorder
                && xNoCollisionDest >= gameMeasures.bPaddleLeftBorder)
        {
            yIntersection = this._yIntersectionPaddle(gameMeasures.bPaddleX,
                                                        ballXDisplacement,
                                                        ballYDisplacement);
            if (Math.abs(yIntersection - bPaddleY)
                    <= gameMeasures.paddleHalfHeight + gameMeasures.ballRadius)
            {
                this._collisionPaddleRight(bPaddleY, yIntersection,
                                            xNoCollisionDest,
                                            ballYDisplacement);
                return (true);
            }
        }
        return (false);
    }

    private _checkCollisionUp(xDisplacement: number,
                                yDisplacement: number): boolean {
        const   yNoCollisionDest = this._yPosition - gameMeasures.ballRadius
                                    + yDisplacement;

        if (yNoCollisionDest <= 0)
        {
            this._collisionUp(xDisplacement, yNoCollisionDest);
            return (true);
        }
        return (false);
    }

    private _checkCollisionDown(gameHeight: number, xDisplacement: number,
                                yDisplacement: number): boolean {
        const   yNoCollisionDest = this._yPosition + gameMeasures.ballRadius
                                    + yDisplacement;

        if (yNoCollisionDest >= gameHeight)
        {
            this._collisionDown(gameHeight, xDisplacement, yNoCollisionDest);
            return (true);
        }
        return (false);
    }

    private _checkCollisionRight(gameWidth: number, gameHeight: number,
                                    xDisplacement: number): boolean {
        if (this._xPosition + gameMeasures.ballRadius + xDisplacement
                >= gameWidth)
        {
            this._collisionRight(gameWidth, gameHeight);
            return (true);
        }
        return (false);
    }

    private _checkCollisionLeft(gameWidth: number, gameHeight: number,
                                xDisplacement: number): boolean {
        if (this._xPosition - gameMeasures.ballRadius + xDisplacement <= 0)
        {
            this._collisionLeft(gameWidth, gameHeight);
            return (true);
        }
        return (false);
    }

    private _checkHeroCollision(hero: IHeroPhysicsData,
                                    secondsElapsed: number): boolean {
        const   ballData: IBallData = this.heroPhysicsService.checkBallHit({
                    pos: new Vector(this._xPosition, this._yPosition),
                    vel: new Vector(this._xVelocity, this._yVelocity),
                    radius: gameMeasures.ballRadius
                }, hero, secondsElapsed);

        if (ballData)
        {
            this._xPosition = ballData.xPos;
            this._yPosition = ballData.yPos;
            this._xVelocity = ballData.xVel;
            this._yVelocity = ballData.yVel;
            return (true);
        }
        return (false);
    }

    private _checkAnyHeroCollision(data: IGamePhysicsData,
                                    secondsElapsed: number): boolean {
        if (!data.playerA.hero)
            return (false);
        if (this._checkHeroCollision(data.playerA.hero, secondsElapsed))
            return (true);
        if (this._checkHeroCollision(data.playerB.hero, secondsElapsed))
            return (true);
        return (false);
    }

    private _checkCollision(data: IGamePhysicsData, xDisplacement: number,
                            yDisplacement: number,
                            secondsElapsed: number): boolean {
        if (this._checkAnyHeroCollision(data, secondsElapsed))
            return (true);
        if (this._xVelocity < 0)
        {
            if (this._checkCollisionPaddleLeft(data.playerA.paddleY,
                                                xDisplacement, yDisplacement))
                return (true);
            if (this._checkCollisionLeft(gameMeasures.gameWidth,
                                            gameMeasures.gameHeight,
                                            xDisplacement))
                return (true);
        }
        else if ((this._xVelocity > 0))
        {
            if (this._checkCollisionPaddleRight(data.playerB.paddleY,
                                                xDisplacement, yDisplacement))
                return (true);
            if (this._checkCollisionRight(gameMeasures.gameWidth,
                                            gameMeasures.gameHeight,
                                            xDisplacement))
                return (true);
        }
        if (this._checkCollisionUp(xDisplacement, yDisplacement)
                || this._checkCollisionDown(gameMeasures.gameHeight,
                                            xDisplacement, yDisplacement))
            return (true);
        return (false);
    }

    private _displacement(velocity: number, seconds: number): number {
        return (velocity * seconds);
    }

    private _initBall(data: IGamePhysicsData): void {
        this._xPosition = data.ball.xPos;
        this._yPosition = data.ball.yPos;
        this._xVelocity = data.ball.xVel;
        this._yVelocity = data.ball.yVel;
    }

    update(data: Readonly<IGamePhysicsData>, targetTime: number): IBallData {
        const   secondsElapsed: number =
                                (targetTime - data.when) / 1000;
        const   xDisplacement: number = this._displacement(data.ball.xVel,
                                                            secondsElapsed);
        const   yDisplacement: number = this._displacement(data.ball.yVel,
                                                            secondsElapsed);
        
        this._initBall(data);
        if (!this._checkCollision(data, xDisplacement, yDisplacement,
                secondsElapsed))
            this._move(xDisplacement, yDisplacement);
        return({
            xPos: this._xPosition,
            yPos: this._yPosition,
            xVel: this._xVelocity,
            yVel: this._yVelocity
        });
    }

}
