export interface IPaddleInit {
    width: number;
    height: number;
    xPos: number;
    yPos: number;
    side: number;
}
export interface IPaddleClientStart {
    width: number;
    height: number;
    xPos: number;
    yPos: number;
    color: number;
}
export interface IPaddleData {
    xPos: number;
    yPos: number;
}
export declare class Paddle {
    private _width;
    private _height;
    private _halfHeight;
    private _halfWidth;
    private _side;
    private _xPos;
    private _yPos;
    constructor(init: IPaddleInit);
    get height(): number;
    get halfWidth(): number;
    get halfHeight(): number;
    get xPos(): number;
    get yPos(): number;
    get side(): number;
    up(): void;
    down(gameHeight: number): void;
    update(moves: number[], gameHeight: number): void;
    data(): IPaddleData;
    clientStartData(): IPaddleClientStart;
}
