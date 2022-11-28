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

/*
**  IMPORTANT IDEA
**
**  Check ball xVelocity to know which collisions to check
**  from: Paddles, World Right, World Left.
**
**  Check ball yVelocity to know which collisions to check
**  from: World Up, World Down
*/

export class    Ball {

    private _radius: number;
    private _xPosition: number;
    private _yPosition: number;
    private _xVelocity: number; // pixels/second
    private _yVelocity: number; // pixels/second
    private _serveSide: number; // -1 left, 1 right

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

    displacement(axis: string, seconds: number): number {
        if (axis === 'x')
            return (this._xVelocity * seconds);
        if (axis === 'y')
            return (this._yVelocity * seconds);
    }

    private checkCollisionPaddleLeft(paddle: Paddle,
                                ballXDisplacement: number): boolean {
        let ballLeftBorder = this._xPosition - this._radius;
        let paddleRightBorder = paddle.xPos + paddle.halfWidth;

        return (
            ballLeftBorder > paddleRightBorder
            && ballLeftBorder + ballXDisplacement <= paddleRightBorder
            && Math.abs(this._yPosition - paddle.yPos)
                <= paddle.halfHeight + this._radius
        );
    }

    private checkCollisionPaddleRight(paddle: Paddle,
                                ballXDisplacement: number): boolean {
        let ballRightBorder = this._xPosition + this._radius;
        let paddleLeftBorder = paddle.xPos - paddle.halfWidth;

        return (
            ballRightBorder < paddleLeftBorder
            && ballRightBorder + ballXDisplacement >= paddleLeftBorder
            && Math.abs(this._yPosition - paddle.yPos)
                <= paddle.halfHeight + this._radius
        );
    }

    private checkCollisionUp(yDisplacement: number): boolean {
        return (this._yPosition - this._radius + yDisplacement <= 0);
    }

    private checkCollisionDown(gameHeight: number, yDisplacement: number): boolean {
        return (this._yPosition + this._radius + yDisplacement >= gameHeight);
    }

    private checkCollisionRight(gameWidth: number, xDisplacement: number): boolean {
        return (this._xPosition + this._radius + xDisplacement >= gameWidth);
    }

    private checkCollisionLeft(xDisplacement: number): boolean {
        return (this._xPosition - this._radius + xDisplacement <= 0);
    }

    /*
    **  (paddleHitHeight / paddle.height) obtains percentage
    **      of total paddle height.
    **
    **  (* (ballHitVelocity * 2) - ballHitVelocity) relates
    **  paddle height percentage with ball
    **  velocity range (-ballHitVelocity - +ballHitVelocity).
    */
    private collisionPaddleLeft(paddle: Paddle): void {
        const   ballHitVelocity = 300;
        const   paddleHitHeight = this._yPosition - paddle.yPos
                                    + paddle.halfHeight;
        
        this._xPosition = paddle.xPos + paddle.halfWidth + this._radius;
        this._xVelocity = ballHitVelocity;
        this._yVelocity = ((paddleHitHeight / paddle.height)
                            * (ballHitVelocity * 2)) - ballHitVelocity;
    }

    private collisionPaddleRight(paddle: Paddle): void {
        const   ballHitVelocity = 300;
        const   paddleHitHeight = this._yPosition - paddle.yPos
                                    + paddle.halfHeight;
        
        this._xPosition = paddle.xPos - paddle.halfWidth - this._radius;
        this._xVelocity = ballHitVelocity;
        this._yVelocity = ((paddleHitHeight / paddle.height)
                            * (ballHitVelocity * 2)) - ballHitVelocity;
        this._xVelocity *= -1;
    }

    private collisionUp(): void {
        this._yPosition = 0 + this._radius;
        this._yVelocity *= -1;
    }

    private collisionDown(gameHeight: number): void {
        this._yPosition = gameHeight - this._radius;
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

    /*
    **  Does not work with ball next position (ballDisplacement) at the moment.
    **  Working with ball current position for now.
    */
    checkHeroCollision(hero: Hero/*, ballXDisplacement: number,
                        ballYDisplacement: number*/): boolean {
        let ballVelocities: [number, number] =
                hero.checkBallHit(this._xPosition, this._yPosition,
                                    this.radius);

        if (ballVelocities)
        {
            this.xVelocity = ballVelocities[0];
            this.yVelocity = ballVelocities[1];
            return (true);
        }
        return (false);
    }

    //0: left, 1: right, 2: none
    checkPaddleCollision(paddleA: Paddle, paddleB: Paddle,
                            ballXDisplacement:number): boolean {
        if (this.checkCollisionPaddleLeft(paddleA, ballXDisplacement))
        {
            this.collisionPaddleLeft(paddleA);
            return (true);
        }
        else if (this.checkCollisionPaddleRight(paddleB, ballXDisplacement))
        {
            this.collisionPaddleRight(paddleB);
            return (true)
        }
        return (false);
    }

    //0: left, 1: up, 2: right, 3: down, 4: none
    checkBorderCollision(xDisplacement: number, yDisplacement: number,
                            gameWidth: number, gameHeight: number): number {
        if (this.checkCollisionLeft(xDisplacement))
        {
            this.collisionLeft(gameWidth, gameHeight);
            return (0);
        }
        if (this.checkCollisionUp(yDisplacement))
        {
            this.collisionUp();
            return (1);
        }
        if (this.checkCollisionRight(gameWidth, xDisplacement))
        {
            this.collisionRight(gameWidth, gameHeight);
            return (2);
        }
        if (this.checkCollisionDown(gameHeight, yDisplacement))
        {
            this.collisionDown(gameHeight);
            return (3);
        }
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
