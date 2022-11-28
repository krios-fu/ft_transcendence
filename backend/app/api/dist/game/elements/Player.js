"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const Paddle_1 = require("./Paddle");
class Player {
    constructor(init) {
        this._paddle = new Paddle_1.Paddle(init.paddle);
        this._hero = init.hero;
        this._score = init.score;
        this._nick = init.nick;
        this._paddleMoves = [];
        this._heroInvocation = -1;
    }
    get score() {
        return (this._score);
    }
    get nick() {
        return (this._nick);
    }
    get paddle() {
        return (this._paddle);
    }
    get hero() {
        return (this._hero);
    }
    set score(input) {
        this._score = input;
    }
    addPaddleMove(move) {
        if (move != 0 && move != 1)
            return;
        this._paddleMoves.push(move);
    }
    addHeroInvocation(invocation) {
        if (invocation != 0 && invocation != 1)
            return;
        this._heroInvocation = invocation;
    }
    update(seconds, gameHeight) {
        if (this._heroInvocation != -1) {
            this._hero.invocation(this._heroInvocation);
            this._heroInvocation = -1;
        }
        this._hero.update(seconds);
        this._paddle.update(this._paddleMoves, gameHeight);
        this._paddleMoves = [];
    }
    checkHeroEnd() {
        this._hero.checkEnd();
    }
    data() {
        return ({
            paddle: this._paddle.data(),
            hero: this._hero.data(),
            score: this._score
        });
    }
    clientStartData() {
        return ({
            paddle: this._paddle.clientStartData(),
            hero: this._hero.clientStartData(),
            score: this._score,
            nick: this._nick
        });
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map