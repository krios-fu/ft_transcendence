import { Player } from './Player'
import { Ball } from './Ball'

export  class   Game {
    playerA: Player;
    playerB: Player;
    ball: Ball;

    constructor () {
        this.playerA = new Player();
        this.playerB = new Player();
        this.ball = new Ball();
    }
}
