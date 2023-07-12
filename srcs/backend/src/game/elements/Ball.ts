import { Vector } from "../utils/Vector";
import { Hero } from "./Hero";
import { Paddle } from "./Paddle";

export interface    IBallInit {
    radius: number;
    xPos: number;
    yPos: number;
    xVel: number;
    yVel: number;
}

/*
**  Used when sending data to the client for creating game for the first time.
**  That is why there is more data than in IBallData.
*/
export interface    IBallClientStart {
    width: number;
    height: number;
    xPos: number;
    yPos: number;
    xVel: number;
    yVel: number;
    color: number;
}

export interface    IBallData {
    xPos: number;
    yPos: number;
    xVel: number;
    yVel: number;
}

export class    Ball {

    private _radius: number;
    private _xPosition: number;
    private _yPosition: number;
    private _xVelocity: number; // pixels/second
    private _yVelocity: number; // pixels/second
    private _serveSide: number; // -1 left, 1 right

    private readonly _paddleHitVelocity = 300;

    constructor(init: IBallInit) {
        this._radius = init.radius;
        this._xPosition = init.xPos;
        this._yPosition = init.yPos;
        this._xVelocity = init.xVel;
        this._yVelocity = init.yVel;
        this._serveSide = -1;
    }

    get radius(): number {
        return (this._radius);
    }

    get xPosition(): number {
        return (this._xPosition);
    }

    get yPosition(): number {
        return (this._yPosition);
    }

    get xVelocity(): number {
        return (this._xVelocity);
    }

    get yVelocity(): number {
        return (this._yVelocity);
    }

    set xVelocity(input: number) {
        this._xVelocity = input;
    }

    set yVelocity(input: number) {
        this._yVelocity = input;
    }

    mimic(data: IBallData): void {
        this._xPosition = data.xPos;
        this._yPosition = data.yPos;
        this._xVelocity = data.xVel;
        this._yVelocity = data.yVel;
    }

    displacement(axis: string, seconds: number): number {
        if (axis === 'x')
            return (this._xVelocity * seconds);
        if (axis === 'y')
            return (this._yVelocity * seconds);
    }

    /*
    **  Returns y value of intersection between paddle's x axis
    **  and ball's trajectory line.
    */
    private yIntersectionPaddle(paddleX: number, xDisplacement: number,
                                yDisplacement: number): number {
        const   slope = yDisplacement / xDisplacement;

        return ((slope * (paddleX - this._xPosition)) + this._yPosition);
    }

    private checkCollisionPaddleLeft(paddle: Paddle,
                                        ballXDisplacement: number,
                                        ballYDisplacement: number): boolean {
        const   ballLeftBorder = this._xPosition - this._radius;
        const   xNoCollisionDest = ballLeftBorder + ballXDisplacement;
        let     yIntersection: number;

        if (ballLeftBorder > paddle.rightBorder
            && xNoCollisionDest <= paddle.rightBorder)
        {
            yIntersection = this.yIntersectionPaddle(paddle.xPos,
                                                        ballXDisplacement,
                                                        ballYDisplacement);
            if (Math.abs(this._yPosition - paddle.yPos)
                <= paddle.halfHeight + this._radius)
            {
                this.collisionPaddleLeft(paddle, yIntersection,
                                            xNoCollisionDest,
                                            ballYDisplacement);
                return (true);
            }
        }
        return (false);
    }

    private checkCollisionPaddleRight(paddle: Paddle,
                                        ballXDisplacement: number,
                                        ballYDisplacement: number): boolean {
        const   ballRightBorder = this._xPosition + this._radius;
        const   xNoCollisionDest = ballRightBorder + ballXDisplacement;
        let     yIntersection: number;

        if (ballRightBorder < paddle.leftBorder
            && xNoCollisionDest >= paddle.leftBorder)
        {
            yIntersection = this.yIntersectionPaddle(paddle.xPos,
                                                        ballXDisplacement,
                                                        ballYDisplacement);
            if (Math.abs(yIntersection - paddle.yPos)
                <= paddle.halfHeight + this._radius)
            {
                this.collisionPaddleRight(paddle, yIntersection,
                                            xNoCollisionDest,
                                            ballYDisplacement);
                return (true);
            }
        }
        return (false);
    }

    private checkCollisionUp(xDisplacement: number,
                                yDisplacement: number): boolean {
        const   yNoCollisionDest = this._yPosition - this._radius
                                    + yDisplacement;
    
        if (yNoCollisionDest <= 0)
        {
            this.collisionUp(xDisplacement, yNoCollisionDest);
            return (true);
        }
        return (false);
    }

    private checkCollisionDown(gameHeight: number, xDisplacement: number,
                                yDisplacement: number): boolean {
        const   yNoCollisionDest = this._yPosition + this._radius
                                    + yDisplacement;

        if (yNoCollisionDest >= gameHeight)
        {
            this.collisionDown(gameHeight, xDisplacement, yNoCollisionDest);
            return (true);
        }
        return (false);
    }

    private checkCollisionRight(gameWidth: number, gameHeight: number,
                                    xDisplacement: number): boolean {
        if (this._xPosition + this._radius + xDisplacement >= gameWidth)
        {
            this.collisionRight(gameWidth, gameHeight);
            return (true);
        }
        return (false);
    }

    private checkCollisionLeft(gameWidth: number, gameHeight: number,
                                xDisplacement: number): boolean {
        if (this._xPosition - this._radius + xDisplacement <= 0)
        {
            this.collisionLeft(gameWidth, gameHeight);
            return (true);
        }
        return (false);
    }

    private paddleBounceX(xNoCollisionDest: number, prevVelocityX: number,
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

    private paddleBounceY(yDisplacement: number, prevVelocityY: number,
                            yIntersection: number): number {
        const   noCollisionDest: number = this._yPosition + yDisplacement;
        const   bounceAmount: number = noCollisionDest - yIntersection;
        let     result: number = yIntersection;

        // Rule of Three
        result += (this._yVelocity * bounceAmount) / prevVelocityY;
        return (result);
    }

    /*
    **  (paddleHitHeight / paddle.height) obtains percentage
    **      of total paddle height.
    **
    **  (* (ballHitVelocity * 2) - ballHitVelocity) relates
    **  paddle height percentage with ball
    **  velocity range (-ballHitVelocity - +ballHitVelocity).
    */
    private collisionPaddleLeft(paddle: Paddle, yIntersection: number,
                                    xNoCollisionDest: number,
                                    yDisplacement: number): void {
        const   prevVelocityX = this._xVelocity;
        const   prevVelocityY = this._yVelocity;
        const   paddleHitHeight = yIntersection - paddle.yPos
                                    + paddle.halfHeight;
        
        this._xVelocity = this._paddleHitVelocity;
        this._yVelocity = ((paddleHitHeight / paddle.height)
                            * (this._paddleHitVelocity * 2))
                            - this._paddleHitVelocity;
        this._xPosition = this.paddleBounceX(xNoCollisionDest, prevVelocityX,
                                                paddle.rightBorder)
                                                + this._radius;
        this._yPosition = this.paddleBounceY(yDisplacement, prevVelocityY,
                                                yIntersection);
    }

    private collisionPaddleRight(paddle: Paddle, yIntersection: number,
                                    xNoCollisionDest: number,
                                    yDisplacement: number): void {
        const   prevVelocityX = this._xVelocity;
        const   prevVelocityY = this._yVelocity;
        const   paddleHitHeight = yIntersection - paddle.yPos
                                    + paddle.halfHeight;
        
        this._xVelocity = this._paddleHitVelocity;
        this._yVelocity = ((paddleHitHeight / paddle.height)
                            * (this._paddleHitVelocity * 2))
                            - this._paddleHitVelocity;
        this._xVelocity *= -1;
        this._xPosition = this.paddleBounceX(xNoCollisionDest, prevVelocityX,
                                                paddle.leftBorder)
                                                - this._radius;
        this._yPosition = this.paddleBounceY(yDisplacement, prevVelocityY,
                                                yIntersection);
    }

    private collisionUp(xDisplacement: number, yNoCollisionDest: number): void {
        this._xPosition += xDisplacement;
        this._yPosition = (yNoCollisionDest * -1) + this._radius;
        this._yVelocity *= -1;
    }

    private collisionDown(gameHeight: number, xDisplacement: number,
                            yNoCollisionDest: number): void {
        this._xPosition += xDisplacement;
        this._yPosition = gameHeight - (yNoCollisionDest - gameHeight)
                            - this._radius;
        this._yVelocity *= -1;
    }

    private collisionRight(gameWidth: number, gameHeight: number): void {
        this._xVelocity = 0;
        this._yVelocity = 0;
        this._xPosition = (gameWidth / 2) - this._radius;
        this._yPosition = (gameHeight / 2) - this._radius;
    }

    private collisionLeft(gameWidth: number, gameHeight: number): void {
        this._xVelocity = 0;
        this._yVelocity = 0;
        this._xPosition = (gameWidth / 2) - this._radius;
        this._yPosition = (gameHeight / 2) - this._radius;
    }

    checkHeroCollision(hero: Hero, secondsElapsed: number): boolean {
        const   ballData: IBallData =
                hero.checkBallHit({
                    pos: new Vector(this._xPosition, this._yPosition),
                    vel: new Vector(this._xVelocity, this._yVelocity),
                    radius: this.radius
                }, secondsElapsed);

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

    checkPaddleCollision(paddleA: Paddle, paddleB: Paddle,
                            ballXDisplacement:number,
                            ballYDisplacement: number): boolean {
        if (this._xVelocity < 0)
        {
            if (this.checkCollisionPaddleLeft(paddleA, ballXDisplacement,
                                                ballYDisplacement))
                return (true);
        }
        else if (this.checkCollisionPaddleRight(paddleB, ballXDisplacement,
                                                ballYDisplacement))
            return (true);
        return (false);
    }

    //0: left, 1: up, 2: right, 3: down, 4: none
    checkBorderCollision(xDisplacement: number, yDisplacement: number,
                            gameWidth: number, gameHeight: number): number {
        if (this._xVelocity < 0)
        {
            if (this.checkCollisionLeft(gameWidth, gameHeight, xDisplacement))
                return (0);
        }
        else if (this.checkCollisionRight(gameWidth, gameHeight, xDisplacement))
            return (2);
        if (this._yVelocity < 0)
        {
            if (this.checkCollisionUp(xDisplacement, yDisplacement))
                return (1);
        }
        else if (this.checkCollisionDown(gameHeight, xDisplacement,
                                            yDisplacement))
            return (3);
        return (4);
    }

    move(xDisplacement: number, yDisplacement: number): void {
        this._xPosition += xDisplacement;
        this._yPosition += yDisplacement;
    }

    serve(): void {
        let maxVel = 200;
        let minVel = 100;

        this._xVelocity = Math.random() * (maxVel - minVel) + minVel;
        this._yVelocity = Math.random() * (maxVel - (-maxVel)) + (-maxVel);
        this._xVelocity *= this._serveSide;
        this._serveSide *= -1; //Changes side for next serve
    }

    data(): IBallData {
        return ({
            xPos: this._xPosition,
            yPos: this._yPosition,
            xVel: this._xVelocity,
            yVel: this._yVelocity
        });
    }

    clientStartData(): IBallClientStart {
        return ({
            width: this._radius * 2,
            height: this._radius * 2,
            xPos: this._xPosition,
            yPos: this._yPosition,
            xVel: this._xVelocity,
            yVel: this._yVelocity,
            color: 0xffffff
        });
    }

}
