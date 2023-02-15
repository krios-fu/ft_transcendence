const   paddleWidth = 10;
const   paddleHeight = 50;
const   paddleHalfWidth = paddleWidth / 2;
const   paddleHalfHeight = paddleHeight / 2;
const   aPaddleX = 50;
const   bPaddleX = 750;

export const    gameMeasures: {
    readonly gameWidth: number;
    readonly gameHeight: number;
    readonly paddleWidth: number;
    readonly paddleHeight: number;
    readonly paddleHalfHeight: number;
    readonly paddleHalfWidth: number;
    readonly aPaddleX: number;
    readonly bPaddleX: number;
    readonly aPaddleRightBorder: number;
    readonly bPaddleLeftBorder: number;
    readonly ballRadius: number;
    readonly paddleHitVelocity: number;
} = {
    gameWidth: 800,
    gameHeight: 600,
    paddleWidth: paddleWidth,
    paddleHeight: paddleHeight,
    paddleHalfWidth: paddleHalfWidth,
    paddleHalfHeight: paddleHalfHeight,
    aPaddleX: aPaddleX,
    bPaddleX: bPaddleX,
    aPaddleRightBorder: aPaddleX + paddleHalfWidth,
    bPaddleLeftBorder: bPaddleX - paddleHalfWidth,
    ballRadius: 5,
    paddleHitVelocity: 300
}
