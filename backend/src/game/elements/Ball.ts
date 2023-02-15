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
