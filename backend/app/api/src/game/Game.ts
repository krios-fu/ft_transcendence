import { Player } from './Player'
import { Ball } from './Ball'

export  enum    GameState {
    Paused,
    Running
}

export  class   Game {
    width: number; //Make it static
    height: number; //Make it static
    playerA: Player;
    playerB: Player;
    ball: Ball;
    serveSide: number; // -1 left, 1 right
    lastUpdate: number; //timestamp milliseconds
    state: GameState;

    private static  winScore: number = 3;

    constructor (playerANick: string, playerBNick: string) {
        this.width = 800;
        this.height = 600;
        this.playerA = new Player(10, 50, 50, 300, 0, playerANick);
        this.playerB = new Player(10, 50, 750, 300, 0, playerBNick);
        this.ball = new Ball(10, 395, 295, 0, 0);
        this.serveSide = -1;
        this.lastUpdate = Date.now();
        this.state = GameState.Running;
    }

    static getWinScore(): number {
        return (this.winScore);
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
