import {
    IPlayerClientStart,
    IPlayerData,
    Player
} from './Player'
import {
    Ball,
    IBallClientStart,
    IBallData
} from './Ball'
import { HeroCreator } from './HeroCreator';

export enum    GameState {
    Paused,
    Running
}

export interface    IGameClientStart {
    playerA: IPlayerClientStart;
    playerB: IPlayerClientStart;
    ball: IBallClientStart;
}

export interface    IGameData {
    playerA: IPlayerData;
    playerB: IPlayerData;
    ball: IBallData;
}

export class   Game {

    private _width: number; //Make it static
    private _height: number; //Make it static
    private _playerA: Player;
    private _playerB: Player;
    private _ball: Ball;
    private _lastUpdate: number; //timestamp milliseconds
    private _state: GameState;

    private static  winScore: number = 3;

    constructor (playerANick: string, playerBNick: string,
                    playerAHero: number, playerBHero: number) {
        let heroCreator: HeroCreator;

        this._width = 800;
        this._height = 600;
        heroCreator = new HeroCreator(this._width, this._height);
        this._playerA = new Player({
            paddle: {
                width: 10,
                height: 50,
                xPos: 50,
                yPos: 300,
                side: 0
            },
            score: 0,
            nick: playerANick,
            hero: heroCreator.create(playerAHero, 0),
            gameWidth: this._width,
            gameHeight: this._height
        });
        this._playerB = new Player({
            paddle: {
                width: 10,
                height: 50,
                xPos: 750,
                yPos: 300,
                side: 1
            },
            score: 0,
            nick: playerBNick,
            hero: heroCreator.create(playerBHero, 1),
            gameWidth: this._width,
            gameHeight: this._height
        });
        this._ball = new Ball({
            radius: 5,
            xPos: 395,
            yPos: 295,
            xVel: 0,
            yVel: 0
        });
        this._lastUpdate = Date.now();
        this._state = GameState.Running;
    }

    get state(): GameState {
        return (this._state);
    }

    set state(input: GameState) {
        this._state = input;
    }

    static getWinScore(): number {
        return (this.winScore);
    }

    pause(): void {
        this._state = GameState.Paused;
    }

    serveBall(): void {
        this._ball.serve();
    }

    //winner: 0 === playerA, 1 === playerB
    forceWin(winner: number): void {
        this._playerA.score = winner === 0 ? Game.getWinScore() : 0;
        this._playerB.score = winner === 1 ? Game.getWinScore() : 0;
    }

    //player: 0 === playerA, 1 === playerB
    checkWin(player: number): boolean {
        if (player === 1)
            return (this._playerB.score === Game.getWinScore());
        return (this._playerA.score === Game.getWinScore());
    }

    getWinnerNick(): string {
        if (this._playerA.score === Game.getWinScore())
            return (this._playerA.nick);
        if (this._playerB.score === Game.getWinScore())
            return (this._playerB.nick);
        return ("");
    }

    getWinnerScore(): number {
        const   playerAScore: number = this._playerA.score;
        const   playerBScore: number = this._playerB.score;
    
        if (playerAScore === Game.getWinScore())
            return (playerAScore);
        if (playerBScore === Game.getWinScore())
            return (playerBScore);
        return (undefined);
    }

    getLoserScore(): number {
        const   playerAScore: number = this._playerA.score;
        const   playerBScore: number = this._playerB.score;
    
        if (playerAScore === Game.getWinScore())
            return (playerBScore);
        if (playerBScore === Game.getWinScore())
            return (playerAScore);
        return (undefined);
    }

    private deltaTime(currentTime: number): number {
        return ((currentTime - this._lastUpdate) / 1000);
    }

    private checkBorderCollision(ballXDisplacement: number,
                                    ballYDisplacement: number): number {
        let border: number;

        border = this._ball.checkBorderCollision(ballXDisplacement,
                    ballYDisplacement, this._width, this._height);
        if (border === 0)
            this._playerB.score += 1;
        else if (border === 2)
            this._playerA.score += 1;
        return (border);
    }

    private ballUpdate(secondsElapsed: number): boolean {
        const   ballXDisplacement: number =
                    this._ball.displacement('x', secondsElapsed);
        const   ballYDisplacement: number =
                    this._ball.displacement('y', secondsElapsed);
        let     border: number;
        
        /*
        **  Hero collisions do not work with ball next
        **  position (ballDisplacement) at the moment.
        */
        if (this._ball.checkHeroCollision(this._playerA.hero/*,
                ballXDisplacement, ballYDisplacement*/))
            return (false);
        else if (this._ball.checkHeroCollision(this._playerB.hero/*,
                    ballXDisplacement, ballYDisplacement*/))
            return (false);
        else if (this._ball.checkPaddleCollision(this._playerA.paddle,
                    this._playerB.paddle, ballXDisplacement))
            return (false);
        border = this.checkBorderCollision(ballXDisplacement,
                    ballYDisplacement);
        if (border >= 0 && border < 4)
        {
            if (border === 0 || border === 2)
                return (true);
            return (false);
        }
        else
            this._ball.move(ballXDisplacement, ballYDisplacement);
        return (false);
    }

    addPaddleAMove(move: number): void {
        this._playerA.addPaddleMove(move);
    }

    addPaddleBMove(move: number): void {
        this._playerB.addPaddleMove(move);
    }

    addHeroAInvocation(invocation: number): void {
        this._playerA.addHeroInvocation(invocation);
    }

    addHeroBInvocation(invocation: number): void {
        this._playerB.addHeroInvocation(invocation);
    }

    update(): boolean {
        const   currentTime: number = Date.now();
        const   secondsElapsed: number = this.deltaTime(currentTime);
        let     pointTransition: boolean = false;     
        
        this._playerA.update(secondsElapsed, this._height);
        this._playerB.update(secondsElapsed, this._height);
        if (this.ballUpdate(secondsElapsed))
            pointTransition = true;
        // Sets hero's position to initial one if its action ended.
        this._playerA.checkHeroEnd();
        this._playerB.checkHeroEnd();
        this._lastUpdate = currentTime;
        return (pointTransition);
    }

    data(): IGameData {
        return ({
            playerA: this._playerA.data(),
            playerB: this._playerB.data(),
            ball: this._ball.data()
        });
    }

    clientStartData(): IGameClientStart {
        return ({
            playerA: this._playerA.clientStartData(),
            playerB: this._playerB.clientStartData(),
            ball: this._ball.clientStartData()
        });
    }

}
