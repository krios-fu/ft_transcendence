"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paddle = void 0;
class Paddle {
    constructor(init) {
        this._width = init.width;
        this._height = init.height;
        this._halfWidth = this._width / 2;
        this._halfHeight = this._height / 2;
        this._xPos = init.xPos;
        this._yPos = init.yPos;
        this._side = init.side;
    }
    get height() {
        return (this._height);
    }
    get halfWidth() {
        return (this._halfWidth);
    }
    get halfHeight() {
        return (this._halfHeight);
    }
    get xPos() {
        return (this._xPos);
    }
    get yPos() {
        return (this._yPos);
    }
    get side() {
        return (this._side);
    }
    up() {
        if (this._yPos - 8 < this._halfHeight)
            this._yPos = this._halfHeight;
        else
            this._yPos -= 8;
    }
    down(gameHeight) {
        if (this._yPos + 8 > gameHeight - this.halfHeight)
            this._yPos = gameHeight - this.halfHeight;
        else
            this._yPos += 8;
    }
    update(moves, gameHeight) {
        moves.forEach(element => {
            if (element === 1)
                this.up();
            else
                this.down(gameHeight);
        });
    }
    data() {
        return ({
            xPos: this._xPos,
            yPos: this._yPos
        });
    }
    clientStartData() {
        return ({
            width: this._width,
            height: this._height,
            xPos: this._xPos,
            yPos: this._yPos,
            color: 0xffffff
        });
    }
}
exports.Paddle = Paddle;
//# sourceMappingURL=Paddle.js.map