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
import { GameReconciliationService } from '../game.reconciliation.service';
import { GameBuffer } from './GameBuffer';
import { GameUpdateService } from '../game.updateService';

export enum GameState {
    Running,
    Paused,
    Finished, // Natural end
    Terminated // Forced end
}

export interface    IGameClientStart {
    playerA: IPlayerClientStart;
    playerB: IPlayerClientStart;
    ball: IBallClientStart;
    stage?: StageId;
    when: number;
}

export interface    IInputData {
    paddle: boolean; //paddle or hero
    playerA: boolean; //playerA or playerB
    up: boolean; //up or down
    when: number;
}

export interface    IGameData {
    playerA: IPlayerData;
    playerB: IPlayerData;
    ball: IBallData;
    when: number;
}

export interface    IGameResult {
    winnerNick: string;
    loserNick: string;
    winnerScore: number;
    loserScore: number;
}

export enum GameUpdateResult {
    Normal,
    Point,
    Lag
}

export type GameType = "classic" | "hero";

export class   Game {

    private _width: number; //Make it static
    private _height: number; //Make it static
    private _playerA: Player;
    private _playerB: Player;
    private _ball: Ball;
    private _stage?: StageId;  
    private _lastUpdate: number; //timestamp milliseconds
    private _state: GameState;
    private _pointTransition: boolean;
    private _input: IInputData[];
    private _buffer: GameBuffer;

    private static  winScore: number = 3;

    constructor (
        gameSelection: IGameSelectionData,
        private readonly reconciliator: GameReconciliationService
    ) {
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
        this._buffer = new GameBuffer();
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
        this._lastUpdate = Date.now();
        this._buffer.addSnapshot(this.data());
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
    
        if (this._playerA.hero)
        {
            if (this._ball.checkHeroCollision(this._playerA.hero,
                                                secondsElapsed))
                return (false);
            if (this._ball.checkHeroCollision(this._playerB.hero,
                                                secondsElapsed))
                return (false);
        }
        if (this._ball.checkPaddleCollision(
                this._playerA.paddle, this._playerB.paddle,
                ballXDisplacement, ballYDisplacement))
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

    private mimic(data: IGameData): void {
        this._ball.mimic(data.ball);
        this._playerA.mimic(data.playerA);
        this._playerB.mimic(data.playerB);
        this._lastUpdate = data.when;
    }

    private applyInput(input: IInputData[]): void {
        input.forEach(elem => {
            if (elem.paddle)
            {
                if (elem.playerA)
                    this._playerA.updatePaddle(elem.up, this._height);
                else
                    this._playerB.updatePaddle(elem.up, this._height);
            }
            else
            {//Just marks corresponding hero sprite as active
                if (elem.playerA)
                    this._playerA.processHeroInvocation(elem.up);
                else
                    this._playerB.processHeroInvocation(elem.up);
            }
        });
    }

    private updateWorld(targetTime: number): void {
        const   secondsElapsed: number = this.deltaTime(targetTime);
    
        if (this.ballUpdate(secondsElapsed))
            this._pointTransition = true;
        if (this._playerA.hero)
        {
            this._playerA.updateHero(secondsElapsed);
            this._playerB.updateHero(secondsElapsed);
            if (this._pointTransition)
            {
                this._playerA.hero.resetInvocation();
                this._playerB.hero.resetInvocation();
            }
        }
    }

    private updateSnapshot(snapshot: IGameData,
                            input: IInputData[]): void {
        let playerData: IPlayerData;
    
        this.applyInput(input);
        if (this._ball.xVelocity === 0)
        { // To preserve ball serve information
            this._ball.xVelocity = snapshot.ball.xVel;
            this._ball.yVelocity = snapshot.ball.yVel;
        }
        this.updateWorld(snapshot.when);
        snapshot.ball = {...this._ball.data()};
        playerData = this._playerA.data();
        snapshot.playerA.paddleY = playerData.paddleY;
        snapshot.playerA.score = playerData.score;
        if (snapshot.playerA.hero)
            snapshot.playerA.hero = {...playerData.hero};
        playerData = this._playerB.data();
        snapshot.playerB.paddleY = playerData.paddleY;
        snapshot.playerB.score = playerData.score;
        if (snapshot.playerB.hero)
            snapshot.playerB.hero = {...playerData.hero};
        this._lastUpdate = snapshot.when;
    }

    private reconstruct(snapshots: IGameData[],
                            inputs: IInputData[]): void {
        let     snapIter: number = 0;
        let     inputIter: number = 0;
        let     inputBatch: IInputData[] = [];
        const   processBatch = () => {
            this.updateSnapshot(snapshots[snapIter], inputBatch);
            inputBatch = [];
        };
    
        this.mimic(snapshots[snapIter]);
        ++snapIter; // The initial snapshot just sets up the initial values
        // There will always be a snapshot after the last input
        for (; inputIter < inputs.length; ++inputIter)
        {
            if (inputs[inputIter].when >= snapshots[snapIter].when)
            {
                processBatch();
                ++snapIter;
            }
            inputBatch.push(inputs[inputIter]); //Storing just references
            if (inputIter + 1 === inputs.length) // Last input
            {
                processBatch();
                ++snapIter;
            }
        }
        for (; snapIter < snapshots.length; ++snapIter)
        {
            processBatch();
        }
        if (snapshots[snapIter - 1].ball.xVel != 0)
        {
            /*
            **  After reconstructing the world, the last score has been
            **  determined wrong, and the point continues.
            **
            **  Ball serve timeout must be higher than Reconciliator.timeLimit,
            **  so there is no risk of serving after a world recontruction that
            **  cancels a point.
            **
            **  The ball's serveSide remains correct after cancelling the
            **  serveOrder.
            */
            // This corrects a finished game state after a cancelled match point
            if (this._state === GameState.Finished)
            {
                this._state = GameState.Running;
            }
        }
    }

    private reconcileInput(): boolean {
        const   [bufferReconIndex, inputDropIndex] =
                    this.reconciliator.reconcile(this._input,
                                                    this._buffer.inputs,
                                                    this._lastUpdate);
        let     reconSnapshots: IGameData[];
        let     reconInputs: IInputData[];
        
        if (bufferReconIndex === undefined)
            return (true);
        if (inputDropIndex != -1)
            this._input = this._input.slice(inputDropIndex);
        else
            return (false);
        reconSnapshots = this.reconciliator.getAffectedSnapshots(
            this._buffer.inputs[bufferReconIndex],
            this._buffer.snapshots
        );
        reconInputs = this.reconciliator.getAffectedInputs(
            reconSnapshots[0],
            this._buffer.inputs
        );
        if (!reconSnapshots.length || !reconInputs.length)
            return (true);
        this.reconstruct(reconSnapshots, reconInputs);
        return (false);
    }

    /*
    **  Oldest first.
    **
    **  Older when < Newer when
    */
    private sortInput(): void {
        this._input.sort((a, b) => a.when - b.when);
    }

    /*
    **  Returns if it could process all input.
    */
    private processInput(): boolean {    
        this.sortInput();
        if (this.reconcileInput())
            return (true);
        this.applyInput(this._input);
        return (false);
    }

    update(): GameUpdateResult {
        const   currentTime: number = Date.now();
    
        this._pointTransition = false;
        if (this.processInput())
        {// Not all inputs could be processed
            return (GameUpdateResult.Lag);
        }
        this.updateWorld(currentTime);
        if (this._pointTransition)
        {
            if (this.getWinnerNick() != "")
                this._state = GameState.Finished;
        }
        this._lastUpdate = currentTime;
        this._buffer.addSnapshot(this.data());
        this._buffer.addInput(this._input, this._buffer.snapshots[0]);
        this._input = [];
        if (this._pointTransition)
            return (GameUpdateResult.Point);
        return (GameUpdateResult.Normal);
    }

    data(): IGameData {
        return ({
            playerA: this._playerA.data(),
            playerB: this._playerB.data(),
            ball: this._ball.data(),
            when: this._lastUpdate
        });
    }

    clientStartData(): IGameClientStart {
        return ({
            playerA: this._playerA.clientStartData(),
            playerB: this._playerB.clientStartData(),
            ball: this._ball.clientStartData(),
            stage: this._stage,
            when: this._lastUpdate
        });
    }

}
