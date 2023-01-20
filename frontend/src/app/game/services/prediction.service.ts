import { Injectable } from "@angular/core";
import { Vector } from "../utils/Vector";
import { IBallData } from "../elements/Ball";
import { IHeroData } from "../elements/Hero";
import {
    HeroPredictionService,
    IHeroPredictionInit
} from "./hero-prediction.service";
import { Circle } from "../utils/Circle";

export interface    IPredictionInit {
    gameWidth: number;
    gameHeight: number;
    paddleWidth: number;
    paddleHeight: number;
    aPaddleX: number;
    bPaddleX: number;
    ballRadius: number;
    heroInit?: IHeroPredictionInit;
}

export interface    IPredictionInput {
    fromTime: number;
    toTime: number;
    aPaddleY: number;
    bPaddleY: number;
    ball: IBallData;
    aHero?: IHeroData;
    bHero?: IHeroData;
}

export interface   IPredictionOutput {
    ball: IBallData;
    aHero?: IHeroData;
    bHero?: IHeroData;
}

@Injectable({
    providedIn: 'root'
})
export class    PredictionService {

    private _init: boolean;
    private _gameWidth: number;
    private _gameHeight: number;
    private _paddleWidth: number;
    private _paddleHeight: number;
    private _paddleHalfWidth: number;
    private _paddleHalfHeight: number;
    private _aPaddleX: number;
    private _aPaddleRightBorder: number;
    private _bPaddleX: number;
    private _bPaddleLeftBorder: number;
    private _ballRadius: number;
    private _ballX: number;
    private _ballY: number;
    private _ballVelocityX: number;
    private _ballVelocityY: number;

    constructor(
        private readonly heroPredictor: HeroPredictionService
    ) {
        this._init = false;
        this._gameWidth = 0;
        this._gameHeight = 0;
        this._paddleWidth = 0;
        this._paddleHeight = 0;
        this._paddleHalfWidth = 0;
        this._paddleHalfHeight = 0;
        this._aPaddleX = 0;
        this._bPaddleX = 0;
        this._aPaddleRightBorder = 0;
        this._bPaddleLeftBorder = 0;
        this._ballRadius = 0;
        this._ballX = 0;
        this._ballY = 0;
        this._ballVelocityX = 0;
        this._ballVelocityY = 0;
    }

    init(data: IPredictionInit): void {
        if (!data)
        {
            this._init = false;
            this.heroPredictor.init(data);
            return ;
        }
        this._init = true;
        this._gameWidth = data.gameWidth;
        this._gameHeight = data.gameHeight;
        this._paddleWidth = data.paddleWidth;
        this._paddleHeight = data.paddleHeight;
        this._paddleHalfWidth = this._paddleWidth / 2;
        this._paddleHalfHeight = data.paddleHeight / 2;
        this._aPaddleX = data.aPaddleX;
        this._bPaddleX = data.bPaddleX;
        this._aPaddleRightBorder = this._aPaddleX + this._paddleHalfWidth;
        this._bPaddleLeftBorder = this._bPaddleX - this._paddleHalfWidth;
        this._ballRadius = data.ballRadius;
        this.heroPredictor.init(data.heroInit);
    }

    private move(xDisplacement: number, yDisplacement: number): void {
        this._ballX += xDisplacement;
        this._ballY += yDisplacement;
    }

    private checkCollisionUp(xDisplacement: number,
                                yDisplacement: number): boolean {
        const   noCollisionDest: number = this._ballY - this._ballRadius
                                            + yDisplacement;
        
        if (noCollisionDest <= 0)
        {
            this._ballX += xDisplacement;
            this._ballY = (noCollisionDest * -1) + this._ballRadius;
            this._ballVelocityY *= -1;
            return (true);
        }
        return (false);
    }

    private checkCollisionDown(gameHeight: number, xDisplacement: number,
                                yDisplacement: number): boolean {
        if (this._ballY + this._ballRadius + yDisplacement >= gameHeight)
        {
            this._ballX += xDisplacement;
            this._ballY = gameHeight - (this._ballY + yDisplacement + this._ballRadius
                        - gameHeight) - this._ballRadius;
            this._ballVelocityY *= -1;
            return (true);
        }
        return (false);
    }

    private checkCollisionRight(gameWidth: number, gameHeight: number,
                                    xDisplacement: number): boolean {
        if (this._ballX + this._ballRadius + xDisplacement >= gameWidth)
        {
            this._ballVelocityX = 0;
            this._ballVelocityY = 0;
            this._ballX = (gameWidth / 2) - this._ballRadius;
            this._ballY = (gameHeight / 2) - this._ballRadius;
            return (true);
        }
        return (false);
    }

    private checkCollisionLeft(gameWidth: number, gameHeight: number,
                                xDisplacement: number): boolean {
        if (this._ballX - this._ballRadius + xDisplacement <= 0)
        {
            this._ballVelocityX = 0;
            this._ballVelocityY = 0;
            this._ballX = (gameWidth / 2) - this._ballRadius;
            this._ballY = (gameHeight / 2) - this._ballRadius;
            return (true);
        }
        return (false);
    }

    private paddleBounceX(xNoCollisionDest: number, prevVelocityX: number,
                            paddleBorder: number): number {
        const   bounceAmount: number = (xNoCollisionDest - paddleBorder) * -1;
        let     result: number = paddleBorder;

        if (prevVelocityX === this._ballVelocityX * -1)
            result += bounceAmount;
        else
        {
            // Rule of Three
            result += ((this._ballVelocityX * bounceAmount) / prevVelocityX) * -1;
        }
        return (result);
    }

    private paddleBounceY(yDisplacement: number, prevVelocityY: number,
                            yIntersection: number): number {
        const   noCollisionDest: number = this._ballY + yDisplacement;
        const   bounceAmount: number = (noCollisionDest - yIntersection);
        let     result: number = yIntersection;

        // Rule of Three
        result += (this._ballVelocityY * bounceAmount) / prevVelocityY;
        return (result);
    }

    private collisionPaddleLeft(paddleY: number, yIntersection: number,
                                    xNoCollisionDest: number,
                                    yDisplacement: number): void {
        const   prevVelocityX: number = this._ballVelocityX;
        const   prevVelocityY: number = this._ballVelocityY;
        const   ballHitVelocity = 300;
        const   paddleHitHeight = yIntersection - paddleY
                                    + this._paddleHalfHeight;
    
        this._ballVelocityX = ballHitVelocity;
        this._ballVelocityY = ((paddleHitHeight / this._paddleHeight)
                            * (ballHitVelocity * 2))
                            - ballHitVelocity;
        this._ballX = this.paddleBounceX(xNoCollisionDest, prevVelocityX,
                                        this._aPaddleRightBorder)
                                    + this._ballRadius;
        this._ballY = this.paddleBounceY(yDisplacement, prevVelocityY,
                                        yIntersection);
    }

    private collisionPaddleRight(paddleY: number, yIntersection: number,
                                    xNoCollisionDest: number,
                                    yDisplacement: number): void {
        const   prevVelocityX: number = this._ballVelocityX;
        const   prevVelocityY: number = this._ballVelocityY;
        const   ballHitVelocity = 300;
        const   paddleHitHeight = yIntersection - paddleY
                                    + this._paddleHalfHeight;
        
        this._ballVelocityX = ballHitVelocity;
        this._ballVelocityY = ((paddleHitHeight / this._paddleHeight)
                            * (ballHitVelocity * 2))
                            - ballHitVelocity;
        this._ballVelocityX *= -1;
        this._ballX = this.paddleBounceX(xNoCollisionDest, prevVelocityX,
                                        this._bPaddleLeftBorder)
                                    - this._ballRadius;
        this._ballY = this.paddleBounceY(yDisplacement, prevVelocityY,
                                        yIntersection);
    }

    private yIntersectionPoint(paddleX: number, xDisplacement: number,
                                yDisplacement: number): number {
        const   slope = yDisplacement / xDisplacement;
    
        return ((slope * (paddleX - this._ballX)) + this._ballY)
    }

    private checkPaddleCollisionLeft(aPaddleY: number, xDisplacement: number,
                                        yDisplacement: number): boolean {
        const   xNoCollisionDest: number = this._ballX - this._ballRadius
                                            + xDisplacement;
        let     yIntersection: number;
    
        if (xNoCollisionDest <= this._aPaddleRightBorder
            && this._ballX - this._ballRadius > this._aPaddleRightBorder)
        {
            yIntersection = this.yIntersectionPoint(this._aPaddleRightBorder,
                                                        xDisplacement,
                                                        yDisplacement);
            if (Math.abs(yIntersection - aPaddleY)
                    <= this._paddleHalfHeight + this._ballRadius)
            {
                this.collisionPaddleLeft(aPaddleY, yIntersection,
                                            xNoCollisionDest, yDisplacement);
                return (true);
            }
        }
        return (false);
    }

    private checkPaddleCollisionRight(bPaddleY: number, xDisplacement: number,
                                        yDisplacement: number): boolean {
        const   xNoCollisionDest: number = this._ballX + this._ballRadius
                                            + xDisplacement;
        let     yIntersection: number;

        if (xNoCollisionDest >= this._bPaddleLeftBorder
            && this._ballX + this._ballRadius < this._bPaddleLeftBorder)
        {
            yIntersection = this.yIntersectionPoint(this._bPaddleLeftBorder,
                                                        xDisplacement,
                                                        yDisplacement);
            if (Math.abs(yIntersection - bPaddleY)
                    <= this._paddleHalfHeight + this._ballRadius)
            {
                this.collisionPaddleRight(bPaddleY, yIntersection,
                                            xNoCollisionDest, yDisplacement);
                return (true);
            }
        }
        return (false);
    }

    /*
    **  The ball cannot collide with aHero and bHero during the same update.
    */
    private _checkHeroCollision(data: IPredictionInput,
                                    secondsElapsed: number): boolean {
        const   circle: Circle = {
            pos: new Vector(this._ballX, this._ballY),
            vel: new Vector(this._ballVelocityX, this._ballVelocityY),
            radius: this._ballRadius
        }
        let ballUpdate: IBallData | undefined = undefined;
    
        if (data.aHero?.active)
        {
            ballUpdate = this.heroPredictor.checkBallHit(
                circle,
                data.aHero,
                true,
                secondsElapsed
            );
        }
        if (!ballUpdate && data.bHero?.active)
        {
            ballUpdate = this.heroPredictor.checkBallHit(
                circle,
                data.bHero,
                false,
                secondsElapsed
            );
        }
        if (ballUpdate)
        {
            this._ballX = ballUpdate.xPos;
            this._ballY = ballUpdate.yPos;
            this._ballVelocityX = ballUpdate.xVel;
            this._ballVelocityY = ballUpdate.yVel;
            return (true);
        }
        return (false);
    }

    private checkCollision(data: IPredictionInput, xDisplacement: number,
                            yDisplacement: number,
                            secondsElapsed: number): boolean {
        if (this._checkHeroCollision(data, secondsElapsed))
            return (true);
        if (this._ballVelocityX < 0)
        {
            if (this.checkPaddleCollisionLeft(data.aPaddleY, xDisplacement,
                                                yDisplacement))
                return (true);
            if (this.checkCollisionLeft(this._gameWidth, this._gameHeight,
                                            xDisplacement))
                return (true);
        }
        else if ((this._ballVelocityX > 0))
        {
            if (this.checkPaddleCollisionRight(data.bPaddleY, xDisplacement,
                                                yDisplacement))
                return (true);
            if (this.checkCollisionRight(this._gameWidth, this._gameHeight,
                                            xDisplacement))
                return (true);
        }
        if (this.checkCollisionUp(xDisplacement, yDisplacement)
            || this.checkCollisionDown(this._gameHeight,
                                        xDisplacement, yDisplacement))
            return (true);
        return (false);
    }

    private displacement(velocity: number, seconds: number): number {
        return (velocity * seconds);
    }

    private _processInput(data: IPredictionInput): void {
        this._ballX = data.ball.xPos;
        this._ballY = data.ball.yPos;
        this._ballVelocityX = data.ball.xVel;
        this._ballVelocityY = data.ball.yVel;
    }

    getSnapshot(data: IPredictionInput): IPredictionOutput | undefined {
        const   secondsElapsed: number =
                                (data.toTime - data.fromTime) / 1000;
        const   xDisplacement: number = this.displacement(data.ball.xVel,
                                                            secondsElapsed);
        const   yDisplacement: number = this.displacement(data.ball.yVel,
                                                            secondsElapsed);
    
        if (!data || !this._init)
            return (undefined);        
        this._processInput(data);
        if (!this.checkCollision(data, xDisplacement, yDisplacement,
                secondsElapsed))
            this.move(xDisplacement, yDisplacement);
        if (data.aHero)
            this.heroPredictor.move(data.aHero, true, secondsElapsed);
        if (data.bHero)
            this.heroPredictor.move(data.bHero, false, secondsElapsed);
        return ({
            ball: {
                xPos: this._ballX,
                yPos: this._ballY,
                xVel: this._ballVelocityX,
                yVel: this._ballVelocityY
            },
            aHero: data.aHero,
            bHero: data.bHero
        });
    }
}
