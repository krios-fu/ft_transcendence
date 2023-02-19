import {
    IPlayerClientStart,
    IPlayerData,
    IPlayerPhysicsData,
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
import { GameSnapshotService } from '../game.snapshot.service';
import {
    IHeroData,
    IHeroPhysicsData
} from './Hero';
import { sortedIndexBy } from "lodash";
import { gameMeasures } from '../utils/gameMeasures';

export enum GameState {
    Running,
    Paused,
    Finished
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

export interface    IGamePhysicsData {
    playerA: IPlayerPhysicsData;
    playerB: IPlayerPhysicsData;
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
        private readonly reconciliator: GameReconciliationService,
        private readonly snapshotService: GameSnapshotService
    ) {
        let heroCreator: HeroCreator;

        this._width = gameMeasures.gameWidth;
        this._height = gameMeasures.gameHeight;
        heroCreator = new HeroCreator(this._width, this._height);
        this._playerA = new Player({
            paddle: {
                width: gameMeasures.paddleWidth,
                height: gameMeasures.paddleHeight,
                xPos: gameMeasures.aPaddleX,
                yPos: gameMeasures.gameHeight / 2,
                side: 0
            },
            hero: gameSelection.heroAConfirmed
                    ? heroCreator.create(gameSelection.heroA, 0) : undefined,
            score: 0,
            nick: gameSelection.nickPlayerA
        });
        this._playerB = new Player({
            paddle: {
                width: gameMeasures.paddleWidth,
                height: gameMeasures.paddleHeight,
                xPos: gameMeasures.bPaddleX,
                yPos: gameMeasures.gameHeight / 2,
                side: 1
            },
            hero: gameSelection.heroBConfirmed
                    ? heroCreator.create(gameSelection.heroB, 1) : undefined,
            score: 0,
            nick: gameSelection.nickPlayerB
        });
        this._ball = new Ball({
            radius: gameMeasures.ballRadius,
            xPos: (this._width / 2) - gameMeasures.ballRadius,
            yPos: (this._height / 2) - gameMeasures.ballRadius,
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
        this._lastUpdate = this._lastUpdate
                            + GameUpdateService.updateTimeInterval / 2;
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

    addInput(data: IInputData): void {
        this._input.push(data);
    }

    private mimic(data: IGameData): void {
        this._ball.mimic(data.ball);
        this._playerA.mimic(data.playerA);
        this._playerB.mimic(data.playerB);
        this._lastUpdate = data.when;
    }

    /*
    **  This is a way to obtain the hero sprite info that is necessary
    **  to update their position.
    **
    **  This function transforms an IGameData interface into an IGamePhysicsData
    **  interface each time an update must be done to a snapshot through
    **  the snapshot service. This is not ideal in terms of performance and
    **  code clarity.
    **
    **  Other options I could think of were:
    **  1) Storing in the snapshot buffer IGamePhysicsData instead of IGameData,
    **      but I did not like the idea of storing the same immutable data
    **      in every snapshot.
    **  2) Having the info to calculate physics for each hero type
    **      in the heroPhysicsService, and add a hero identifier property
    **      to each IPlayerData of GameData. But I think this model could reduce
    **      flexibility for future hero changes at an instance level,
    **      it also requires some conversion, and it is a deeper change.
    */
    private getPhysicsSnapshot(snapshot: IGameData): IGamePhysicsData {
        const   result: any = this.snapshotService.clone(snapshot);
        const   heroAPhysics: IHeroPhysicsData = this._playerA.hero ?
                    this._playerA.hero.physicsData() : undefined;
        const   heroBPhysics: IHeroPhysicsData = this._playerB.hero ?
                    this._playerB.hero.physicsData() : undefined;
        const   copyHeroPos = (heroPhysics: IHeroPhysicsData,
                                hero: IHeroData) => {
            heroPhysics.hero.xPos = hero.xPos;
            heroPhysics.hero.yPos = hero.yPos;
            heroPhysics.heroLow.xPos = hero.lowXPos;
            heroPhysics.heroLow.yPos = hero.lowYPos;
        };
        
        if (heroAPhysics)
        {
            copyHeroPos(heroAPhysics, result.playerA.hero);
            copyHeroPos(heroBPhysics, result.playerB.hero);
        }
        return ({
            ball: {...snapshot.ball},
            playerA: {
                paddleY: snapshot.playerA.paddleY,
                hero: heroAPhysics ? heroAPhysics : undefined,
                score: snapshot.playerA.score
            },
            playerB: {
                paddleY: snapshot.playerB.paddleY,
                hero: heroBPhysics ? heroBPhysics : undefined,
                score: snapshot.playerB.score
            },
            when: snapshot.when
        });
    }

    private updateSnapshot(snapshot: Readonly<IGameData>,
                            targetTime: number,
                            input: IInputData[]): IGameData {
        let auxSnapshot: IGameData;
        let pointTransition: boolean;
    
        auxSnapshot = this.snapshotService.applyInput(snapshot, input);
        [auxSnapshot, pointTransition] = this.snapshotService.update(
            this.getPhysicsSnapshot(auxSnapshot),
            targetTime
        );
        if (pointTransition)
            this._pointTransition = true;
        return (auxSnapshot);
    }

    private correctSnapshot(srcSnapshot: IGameData,
                                dstSnapshot: IGameData,
                                input: IInputData[]): void {
        let correctSnapshot: IGameData;
    
        correctSnapshot = this.updateSnapshot(
            srcSnapshot,
            dstSnapshot.when,
            input
        );
        if (correctSnapshot.ball.xVel === 0)
        { //Preserve ball serve velocity data
            correctSnapshot.ball.xVel = dstSnapshot.ball.xVel;
            correctSnapshot.ball.yVel = dstSnapshot.ball.yVel;
        }
        this.snapshotService.copy(
            correctSnapshot,
            dstSnapshot
        );
    }

    private reconstruct(snapshots: IGameData[],
                            inputs: IInputData[]): void {
        let snapIter: number = 1;
        let inputNeedle: number;
        let pendingInput: IInputData[] = inputs.slice();
        let inputBatch: IInputData[] = [];
        
        for (; snapIter < snapshots.length; ++snapIter)
        {
            if (pendingInput.length)
            { // Fill inputBatch with inputs older than snapshots[snapIter]
                inputNeedle = sortedIndexBy(pendingInput, {
                    when: snapshots[snapIter].when
                } as IInputData, (input) => {
                    return (input.when);
                });
                if (inputNeedle != 0)
                {
                    inputBatch = pendingInput.slice(0, inputNeedle);
                    pendingInput = pendingInput.slice(inputNeedle);
                }
            }
            this.correctSnapshot(
                snapshots[snapIter - 1],
                snapshots[snapIter],
                inputBatch
            );
            inputBatch = [];
        }
        this.mimic(snapshots[snapIter - 1]);
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
    **  Sorts this._input, checks for inputs to reconcile,
    **  In case it finds any, it extracts them from this._input,
    **  reconstructs the corresponding snapshots updating
    **  the input and snapshot buffer accordingly.
    **
    **  Returns false if it could process all input.
    **  True otherwise, which means this._input contained input older than
    **  the reconciliation service's time limit.
    */
    private processInput(): boolean {    
        this.sortInput();
        if (this.reconcileInput())
            return (true);
        return (false);
    }

    private getUpdateTime(): number {
        const   lastBufferSnapshot: IGameData =
                    this._buffer.snapshots[this._buffer.snapshots.length];
        if (lastBufferSnapshot
            && lastBufferSnapshot.when + GameUpdateService.updateTimeInterval
                != this._lastUpdate)
        {
            if (lastBufferSnapshot.ball.xVel === 0)
            {// The current snapshot is a ball serve one
                return (lastBufferSnapshot.when
                            + GameUpdateService.updateTimeInterval);
            }
        }
        return (this._lastUpdate + GameUpdateService.updateTimeInterval);
    }

    update(): GameUpdateResult {
        const   currentTime: number = this.getUpdateTime();
    
        this._pointTransition = false;
        if (this.processInput())
        {// Not all inputs could be processed
            return (GameUpdateResult.Lag);
        }
        this.mimic(this.updateSnapshot(
            this.data(),
            currentTime,
            this._input
        ));
        if (this._pointTransition)
        {
            if (this.getWinnerNick() != "")
                this._state = GameState.Finished;
        }
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
