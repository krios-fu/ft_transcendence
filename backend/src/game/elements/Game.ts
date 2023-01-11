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
import {
    IGameSelectionData,
    StageId
} from './GameSelection';
import { HeroCreator } from './HeroCreator';

export enum    GameState {
    Running,
    Paused,
    Finished
}

export interface    IGameClientStart {
    playerA: IPlayerClientStart;
    playerB: IPlayerClientStart;
    ball: IBallClientStart;
    stage?: string;
}

export interface    IInputData {
    paddle: boolean; //paddle or hero
    playerA: boolean; //playerA or playerB
    up: boolean; //up or down
}

export interface    IGameData {
    playerA: IPlayerData;
    playerB: IPlayerData;
    ball: IBallData;
}

export interface    IGameResult {
    winnerNick: string;
    loserNick: string;
    winnerScore: number;
    loserScore: number;
}

export class   Game {

    protected   _width: number; //Make it static
    protected   _height: number; //Make it static
    protected   _playerA: Player;
    protected   _playerB: Player;
    protected   _ball: Ball;
    private     _stage?: StageId;  
    protected   _lastUpdate: number; //timestamp milliseconds
    protected   _state: GameState;
    protected   _input: IInputData[];

    private static  winScore: number = 3;

    constructor (gameSelection: IGameSelectionData) {
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
            hero: gameSelection.heroAConfirmed
                    ? heroCreator.create(gameSelection.heroA, 0) : undefined,
            score: 0,
            nick: gameSelection.nickPlayerA,
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
            hero: gameSelection.heroBConfirmed
                    ? heroCreator.create(gameSelection.heroB, 1) : undefined,
            score: 0,
            nick: gameSelection.nickPlayerB,
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
        if (gameSelection.heroAConfirmed)
            this._stage = gameSelection.stage;
        this._lastUpdate = Date.now();
        this._state = GameState.Running;
        this._input = [];
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

    isFinished(): boolean {
        return (this._state === GameState.Finished);
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

    getResult(): IGameResult {
        const   winnerNick: string = this.getWinnerNick();
        let     winner: Player;
        let     loser: Player;

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

    protected deltaTime(currentTime: number): number {
        return ((currentTime - this._lastUpdate) / 1000);
    }

    protected checkBorderCollision(ballXDisplacement: number,
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

    protected ballUpdate(secondsElapsed: number): boolean {
        const   ballXDisplacement: number =
                    this._ball.displacement('x', secondsElapsed);
        const   ballYDisplacement: number =
                    this._ball.displacement('y', secondsElapsed);
        let     border: number;
    
        if (this._ball.checkPaddleCollision(this._playerA.paddle,
                this._playerB.paddle, ballXDisplacement, ballYDisplacement))
            return (false);
        else
        {
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
        }
        return (false);
    }

    addInput(data: IInputData): void {
        this._input.push(data);
    }

    protected processInput(): void {
        this._input.forEach(input => {
            if (input.paddle)
            {
                if (input.playerA)
                    this._playerA.updatePaddle(input.up, this._height);
                else
                    this._playerB.updatePaddle(input.up, this._height);
            }
            else
            {//Just marks corresponding hero sprite as active
                if (input.playerA)
                    this._playerA.processHeroInvocation(input.up);
                else
                    this._playerB.processHeroInvocation(input.up);
            }
        });
        this._input = [];
    }

    update(): boolean {
        const   currentTime: number = Date.now();
        const   secondsElapsed: number = this.deltaTime(currentTime);
        let     pointTransition: boolean = false;     
        
        this.processInput();
        if (this.ballUpdate(secondsElapsed))
        {
            pointTransition = true;
            if (this.getWinnerNick() != "")
                this._state = GameState.Finished;
        }
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

    private stringifyStage(id: StageId): string {
        if (!this._playerA.hero)
            return (undefined);
        if (id === StageId.Atlantis)
            return ('atlantis');
        if (id === StageId.Metropolis)
            return ('metropolis');
        return ('wakanda');
    }

    clientStartData(): IGameClientStart {
        return ({
            playerA: this._playerA.clientStartData(),
            playerB: this._playerB.clientStartData(),
            ball: this._ball.clientStartData(),
            stage: this.stringifyStage(this._stage)
        });
    }

}
