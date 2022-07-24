import { Player } from './Player'
import { Ball } from './Ball'

export  class   Game {
    playerA: Player;
    playerB: Player;
    ball: Ball;
    serveSide: number;
    smashSide: number;

    constructor () {
        this.playerA = new Player(50, 25, 0);
        this.playerB = new Player(750, 25, 0);
        this.ball = new Ball(395, 295, 0, 0);
        this.serveSide = 0;
        this.smashSide = 0;
    }
}
