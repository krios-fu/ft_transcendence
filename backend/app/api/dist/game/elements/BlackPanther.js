"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlackPanther = void 0;
const Hero_1 = require("./Hero");
class BlackPanther extends Hero_1.Hero {
    constructor(initData) {
        super(initData);
    }
    ballVelocityAfterHit() {
        let xVelocity;
        if (this._playerSide === 0)
            xVelocity = this._upperSprite.yVelocity;
        else
            xVelocity = this._lowerSprite.yVelocity;
        return ([xVelocity, 0]);
    }
}
exports.BlackPanther = BlackPanther;
//# sourceMappingURL=BlackPanther.js.map