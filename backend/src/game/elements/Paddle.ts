import { gameMeasures } from "../utils/gameMeasures";

export interface    IPaddleInit {
    width: number;
    height: number;
    xPos: number;
    yPos: number;
    side: number;
}

export interface    IPaddleClientStart {
    width: number;
    height: number;
    xPos: number;
    yPos: number;
    color: number;
    displacement: number; // In pixels
}

export class    Paddle {

    private _width: number;
    private _height: number;
    private _halfHeight: number;
    private _halfWidth: number;
    private _leftBorder: number;
    private _rightBorder: number;
    private _side: number; //side: 0 === left, 1 === right
    private _xPos: number;
    private _yPos: number;

    private static _displacement: number = 8;

    constructor(init: IPaddleInit) {
        this._width = init.width;
        this._height = init.height;
        this._halfWidth = this._width / 2;
        this._halfHeight = this._height / 2;
        this._xPos = init.xPos;
        this._yPos = init.yPos;
        this._leftBorder = this._xPos - this._halfWidth;
        this._rightBorder = this._xPos + this._halfWidth;
        this._side = init.side;
    }

    get height(): number {
        return (this._height);
    }

    get halfWidth(): number {
        return (this._halfWidth);
    }

    get halfHeight(): number {
        return (this._halfHeight);
    }

    get leftBorder(): number {
        return (this._leftBorder);
    }

    get rightBorder(): number {
        return (this._rightBorder);
    }

    get xPos(): number {
        return (this._xPos);
    }

    get yPos(): number {
        return (this._yPos);
    }

    get side(): number {
        return (this._side);
    }

    set yPos(yPos: number) {
        this._yPos = yPos;
    }

    private static _up(paddleY: number): number {
        let result: number;
    
        if (paddleY - this._displacement < gameMeasures.paddleHalfHeight)
            result = gameMeasures.paddleHalfHeight;
        else
            result = paddleY - this._displacement;
        return (result);
    }

    private static _down(paddleY: number): number {
        let result: number;
    
        if (paddleY + this._displacement
                > gameMeasures.gameHeight - gameMeasures.paddleHalfHeight)
            result = gameMeasures.gameHeight - gameMeasures.paddleHalfHeight;
        else
            result = paddleY + this._displacement;
        return (result);
    }

    static input(up: boolean, paddleY: number): number {
        return (
            up ? this._up(paddleY)
                : this._down(paddleY)
        );
    }
    
    clientStartData(): IPaddleClientStart {
        return ({
            width: this._width,
            height: this._height,
            xPos: this._xPos,
            yPos: this._yPos,
            color: 0xffffff,
            displacement: Paddle._displacement
        })
    }

}
