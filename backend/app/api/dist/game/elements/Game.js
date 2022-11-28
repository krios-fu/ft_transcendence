"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = exports.GameState = void 0;
const Player_1 = require("./Player");
const Ball_1 = require("./Ball");
const HeroCreator_1 = require("./HeroCreator");
var GameState;
(function (GameState) {
    GameState[GameState["Running"] = 0] = "Running";
    GameState[GameState["Paused"] = 1] = "Paused";
    GameState[GameState["Finished"] = 2] = "Finished";
})(GameState = exports.GameState || (exports.GameState = {}));
class Game {
    constructor(gameSelection) {
        let heroCreator;
        this._width = 800;
        this._height = 600;
        heroCreator = new HeroCreator_1.HeroCreator(this._width, this._height);
        this._playerA = new Player_1.Player({
            paddle: {
                width: 10,
                height: 50,
                xPos: 50,
                yPos: 300,
                side: 0
            },
            score: 0,
            nick: gameSelection.nickPlayerA,
            hero: heroCreator.create(gameSelection.heroA, 0),
            gameWidth: this._width,
            gameHeight: this._height
        });
        this._playerB = new Player_1.Player({
            paddle: {
                width: 10,
                height: 50,
                xPos: 750,
                yPos: 300,
                side: 1
            },
            score: 0,
            nick: gameSelection.nickPlayerB,
            hero: heroCreator.create(gameSelection.heroB, 1),
            gameWidth: this._width,
            gameHeight: this._height
        });
        this._ball = new Ball_1.Ball({
            radius: 5,
            xPos: 395,
            yPos: 295,
            xVel: 0,
            yVel: 0
        });
        this._lastUpdate = Date.now();
        this._state = GameState.Running;
    }
    get state() {
        return (this._state);
    }
    set state(input) {
        this._state = input;
    }
    static getWinScore() {
        return (this.winScore);
    }
    isFinished() {
        return (this._state === GameState.Finished);
    }
    serveBall() {
        this._ball.serve();
    }
    forceWin(winner) {
        this._playerA.score = winner === 0 ? Game.getWinScore() : 0;
        this._playerB.score = winner === 1 ? Game.getWinScore() : 0;
    }
    checkWin(player) {
        if (player === 1)
            return (this._playerB.score === Game.getWinScore());
        return (this._playerA.score === Game.getWinScore());
    }
    getWinnerNick() {
        if (this._playerA.score === Game.getWinScore())
            return (this._playerA.nick);
        if (this._playerB.score === Game.getWinScore())
            return (this._playerB.nick);
        return ("");
    }
    getResult() {
        const winnerNick = this.getWinnerNick();
        let winner;
        let loser;
        if (winnerNick === "")
            return (undefined);
        winner = winnerNick === this._playerA.nick
            ? this._playerA : this._playerB;
        loser = winnerNick != this._playerA.nick
            ? this._playerA : this._playerB;
        return ({
            winnerNick: winner.nick,
            loserNick: loser.nick,
            winnerScore: winner.score,
            loserScore: loser.score
        });
    }
    deltaTime(currentTime) {
        return ((currentTime - this._lastUpdate) / 1000);
    }
    checkBorderCollision(ballXDisplacement, ballYDisplacement) {
        let border;
        border = this._ball.checkBorderCollision(ballXDisplacement, ballYDisplacement, this._width, this._height);
        if (border === 0)
            this._playerB.score += 1;
        else if (border === 2)
            this._playerA.score += 1;
        return (border);
    }
    ballUpdate(secondsElapsed) {
        const ballXDisplacement = this._ball.displacement('x', secondsElapsed);
        const ballYDisplacement = this._ball.displacement('y', secondsElapsed);
        let border;
        if (this._ball.checkHeroCollision(this._playerA.hero))
            return (false);
        else if (this._ball.checkHeroCollision(this._playerB.hero))
            return (false);
        else if (this._ball.checkPaddleCollision(this._playerA.paddle, this._playerB.paddle, ballXDisplacement))
            return (false);
        border = this.checkBorderCollision(ballXDisplacement, ballYDisplacement);
        if (border >= 0 && border < 4) {
            if (border === 0 || border === 2)
                return (true);
            return (false);
        }
        else
            this._ball.move(ballXDisplacement, ballYDisplacement);
        return (false);
    }
    addPaddleAMove(move) {
        this._playerA.addPaddleMove(move);
    }
    addPaddleBMove(move) {
        this._playerB.addPaddleMove(move);
    }
    addHeroAInvocation(invocation) {
        this._playerA.addHeroInvocation(invocation);
    }
    addHeroBInvocation(invocation) {
        this._playerB.addHeroInvocation(invocation);
    }
    update() {
        const currentTime = Date.now();
        const secondsElapsed = this.deltaTime(currentTime);
        let pointTransition = false;
        this._playerA.update(secondsElapsed, this._height);
        this._playerB.update(secondsElapsed, this._height);
        if (this.ballUpdate(secondsElapsed)) {
            pointTransition = true;
            if (this.getWinnerNick() != "")
                this._state = GameState.Finished;
        }
        this._playerA.checkHeroEnd();
        this._playerB.checkHeroEnd();
        this._lastUpdate = currentTime;
        return (pointTransition);
    }
    data() {
        return ({
            playerA: this._playerA.data(),
            playerB: this._playerB.data(),
            ball: this._ball.data()
        });
    }
    clientStartData() {
        return ({
            playerA: this._playerA.clientStartData(),
            playerB: this._playerB.clientStartData(),
            ball: this._ball.clientStartData()
        });
    }
}
exports.Game = Game;
Game.winScore = 3;
//# sourceMappingURL=Game.js.map