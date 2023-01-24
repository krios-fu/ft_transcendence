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
    private _displacement: number;

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
        this._displacement = 8;
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

    up(): void {
        if (this._yPos - this._displacement < this._halfHeight)
            this._yPos = this._halfHeight;
        else
            this._yPos -= this._displacement;
    }

    down(gameHeight: number): void {
        if (this._yPos + this._displacement > gameHeight - this.halfHeight)
            this._yPos = gameHeight - this.halfHeight;
        else
            this._yPos += this._displacement;
    }

    update(up: boolean, gameHeight: number): void {
        if (up)
            this.up();
        else
            this.down(gameHeight);
    }
    
    clientStartData(): IPaddleClientStart {
        return ({
            width: this._width,
            height: this._height,
            xPos: this._xPos,
            yPos: this._yPos,
            color: 0xffffff,
            displacement: this._displacement
        })
    }

}
