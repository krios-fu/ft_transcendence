"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ball = void 0;
class Ball {
    constructor(init) {
        this._radius = init.radius;
        this._xPosition = init.xPos;
        this._yPosition = init.yPos;
        this._xVelocity = init.xVel;
        this._yVelocity = init.yVel;
        this._serveSide = -1;
    }
    get radius() {
        return (this._radius);
    }
    get xPosition() {
        return (this._xPosition);
    }
    get yPosition() {
        return (this._yPosition);
    }
    get xVelocity() {
        return (this._xVelocity);
    }
    get yVelocity() {
        return (this._yVelocity);
    }
    set xVelocity(input) {
        this._xVelocity = input;
    }
    set yVelocity(input) {
        this._yVelocity = input;
    }
    displacement(axis, seconds) {
        if (axis === 'x')
            return (this._xVelocity * seconds);
        if (axis === 'y')
            return (this._yVelocity * seconds);
    }
    checkCollisionPaddleLeft(paddle, ballXDisplacement) {
        let ballLeftBorder = this._xPosition - this._radius;
        let paddleRightBorder = paddle.xPos + paddle.halfWidth;
        return (ballLeftBorder > paddleRightBorder
            && ballLeftBorder + ballXDisplacement <= paddleRightBorder
            && Math.abs(this._yPosition - paddle.yPos)
                <= paddle.halfHeight + this._radius);
    }
    checkCollisionPaddleRight(paddle, ballXDisplacement) {
        let ballRightBorder = this._xPosition + this._radius;
        let paddleLeftBorder = paddle.xPos - paddle.halfWidth;
        return (ballRightBorder < paddleLeftBorder
            && ballRightBorder + ballXDisplacement >= paddleLeftBorder
            && Math.abs(this._yPosition - paddle.yPos)
                <= paddle.halfHeight + this._radius);
    }
    checkCollisionUp(yDisplacement) {
        return (this._yPosition - this._radius + yDisplacement <= 0);
    }
    checkCollisionDown(gameHeight, yDisplacement) {
        return (this._yPosition + this._radius + yDisplacement >= gameHeight);
    }
    checkCollisionRight(gameWidth, xDisplacement) {
        return (this._xPosition + this._radius + xDisplacement >= gameWidth);
    }
    checkCollisionLeft(xDisplacement) {
        return (this._xPosition - this._radius + xDisplacement <= 0);
    }
    collisionPaddleLeft(paddle) {
        const ballHitVelocity = 300;
        const paddleHitHeight = this._yPosition - paddle.yPos
            + paddle.halfHeight;
        this._xPosition = paddle.xPos + paddle.halfWidth + this._radius;
        this._xVelocity = ballHitVelocity;
        this._yVelocity = ((paddleHitHeight / paddle.height)
            * (ballHitVelocity * 2)) - ballHitVelocity;
    }
    collisionPaddleRight(paddle) {
        const ballHitVelocity = 300;
        const paddleHitHeight = this._yPosition - paddle.yPos
            + paddle.halfHeight;
        this._xPosition = paddle.xPos - paddle.halfWidth - this._radius;
        this._xVelocity = ballHitVelocity;
        this._yVelocity = ((paddleHitHeight / paddle.height)
            * (ballHitVelocity * 2)) - ballHitVelocity;
        this._xVelocity *= -1;
    }
    collisionUp() {
        this._yPosition = 0 + this._radius;
        this._yVelocity *= -1;
    }
    collisionDown(gameHeight) {
        this._yPosition = gameHeight - this._radius;
        this._yVelocity *= -1;
    }
    collisionRight(gameWidth, gameHeight) {
        this._xVelocity = 0;
        this._yVelocity = 0;
        this._xPosition = (gameWidth / 2) - this._radius;
        this._yPosition = (gameHeight / 2) - this._radius;
    }
    collisionLeft(gameWidth, gameHeight) {
        this._xVelocity = 0;
        this._yVelocity = 0;
        this._xPosition = (gameWidth / 2) - this._radius;
        this._yPosition = (gameHeight / 2) - this._radius;
    }
    checkHeroCollision(hero) {
        let ballVelocities = hero.checkBallHit(this._xPosition, this._yPosition, this.radius);
        if (ballVelocities) {
            this.xVelocity = ballVelocities[0];
            this.yVelocity = ballVelocities[1];
            return (true);
        }
        return (false);
    }
    checkPaddleCollision(paddleA, paddleB, ballXDisplacement) {
        if (this.checkCollisionPaddleLeft(paddleA, ballXDisplacement)) {
            this.collisionPaddleLeft(paddleA);
            return (true);
        }
        else if (this.checkCollisionPaddleRight(paddleB, ballXDisplacement)) {
            this.collisionPaddleRight(paddleB);
            return (true);
        }
        return (false);
    }
    checkBorderCollision(xDisplacement, yDisplacement, gameWidth, gameHeight) {
        if (this.checkCollisionLeft(xDisplacement)) {
            this.collisionLeft(gameWidth, gameHeight);
            return (0);
        }
        if (this.checkCollisionUp(yDisplacement)) {
            this.collisionUp();
            return (1);
        }
        if (this.checkCollisionRight(gameWidth, xDisplacement)) {
            this.collisionRight(gameWidth, gameHeight);
            return (2);
        }
        if (this.checkCollisionDown(gameHeight, yDisplacement)) {
            this.collisionDown(gameHeight);
            return (3);
        }
        return (4);
    }
    move(xDisplacement, yDisplacement) {
        this._xPosition += xDisplacement;
        this._yPosition += yDisplacement;
    }
    serve() {
        let maxVel = 200;
        let minVel = 100;
        this._xVelocity = Math.random() * (maxVel - minVel) + minVel;
        this._yVelocity = Math.random() * (maxVel - (-maxVel)) + (-maxVel);
        this._xVelocity *= this._serveSide;
        this._serveSide *= -1;
    }
    data() {
        return ({
            xPos: this._xPosition,
            yPos: this._yPosition,
            xVel: this._xVelocity,
            yVel: this._yVelocity
        });
    }
    clientStartData() {
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
exports.Ball = Ball;
//# sourceMappingURL=Ball.js.map