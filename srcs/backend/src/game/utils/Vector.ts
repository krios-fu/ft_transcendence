export class    Vector {

    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    get x(): number {
        return (this._x);
    }

    get y(): number {
        return (this._y);
    }

    static addition(v1: Vector, v2: Vector): Vector {    
        return (
            new Vector(
                v1._x + v2._x,
                v1._y + v2._y
            )
        );
    }

    static subtraction(v1: Vector, v2: Vector): Vector {
        return (
            new Vector(
                v1._x - v2._x,
                v1._y - v2._y
            )
        );
    }

    static dotProduct(v1: Vector, v2: Vector): number {
        const   xProduct = v1._x * v2._x;
        const   yProduct = v1._y * v2._y;
    
        return (xProduct + yProduct);
    }

    static distance(v1: Vector, v2: Vector): number {
        const   xSquared = Math.pow(v2._x - v1._x, 2);
        const   ySquared = Math.pow(v2._y - v1._y, 2);
    
        return (
            Math.sqrt(xSquared + ySquared)
        );
    }

}
