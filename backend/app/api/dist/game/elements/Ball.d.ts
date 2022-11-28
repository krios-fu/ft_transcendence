import { Hero } from "./Hero";
import { Paddle } from "./Paddle";
export interface IBallInit {
    radius: number;
    xPos: number;
    yPos: number;
    xVel: number;
    yVel: number;
}
export interface IBallClientStart {
    width: number;
    height: number;
    xPos: number;
    yPos: number;
    xVel: number;
    yVel: number;
    color: number;
}
export interface IBallData {
    xPos: number;
    yPos: number;
    xVel: number;
    yVel: number;
}
export declare class Ball {
    private _radius;
    private _xPosition;
    private _yPosition;
    private _xVelocity;
    private _yVelocity;
    private _serveSide;
    constructor(init: IBallInit);
    get radius(): number;
    get xPosition(): number;
    get yPosition(): number;
    get xVelocity(): number;
    get yVelocity(): number;
    set xVelocity(input: number);
    set yVelocity(input: number);
    displacement(axis: string, seconds: number): number;
    private checkCollisionPaddleLeft;
    private checkCollisionPaddleRight;
    private checkCollisionUp;
    private checkCollisionDown;
    private checkCollisionRight;
    private checkCollisionLeft;
    private collisionPaddleLeft;
    private collisionPaddleRight;
    private collisionUp;
    private collisionDown;
    private collisionRight;
    private collisionLeft;
    checkHeroCollision(hero: Hero): boolean;
    checkPaddleCollision(paddleA: Paddle, paddleB: Paddle, ballXDisplacement: number): boolean;
    checkBorderCollision(xDisplacement: number, yDisplacement: number, gameWidth: number, gameHeight: number): number;
    move(xDisplacement: number, yDisplacement: number): void;
    serve(): void;
    data(): IBallData;
    clientStartData(): IBallClientStart;
}
