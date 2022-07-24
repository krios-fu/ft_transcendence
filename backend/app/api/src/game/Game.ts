import { Player } from './Player'
import { Ball } from './Ball'

export  class   Game {
    width: number;
    height: number;
    playerA: Player;
    playerB: Player;
    ball: Ball;
    serveSide: number; // -1 left, 1 right
    lastUpdate: number; //timestamp milliseconds

    constructor () {
        this.width = 800;
        this.height = 600;
        this.playerA = new Player(10, 50, 50, 25, 0);
        this.playerB = new Player(10, 50, 750, 25, 0);
        this.ball = new Ball(10, 395, 295, 0, 0);
        this.serveSide = -1;
        this.lastUpdate = Date.now();
    }

    serveBall() {
        let maxVel = 200;
        let minVel = 100;

        this.ball.xVelocity = Math.random() * (maxVel - minVel) + minVel;
        this.ball.yVelocity = Math.random() * (maxVel - (-maxVel)) + (-maxVel);
        this.ball.xVelocity *= this.serveSide;
        this.serveSide *= -1; //Change side for next serve
    }
}
