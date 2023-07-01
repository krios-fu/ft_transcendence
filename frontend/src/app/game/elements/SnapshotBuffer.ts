import {
    IMatchData,
    IMatchInitData,
    Match
} from "./Match";
import { LagCompensationService } from "../services/lag-compensation.service";

export interface    IBufferInit {
    gameWidth: number;
    gameHeight: number;
    matchData: IMatchInitData;
    role: string;
}

export class   SnapshotBuffer {

    private _buffer: IMatchData[];
    private _auxBuffer: IMatchData[];
    private _currentSnapshot: IMatchData | undefined;

    constructor(
        initData: IBufferInit,
        private readonly lagCompensator: LagCompensationService
    ) {
        const   matchData: IMatchInitData = initData.matchData;
    
        this._buffer = [];
        this._auxBuffer = [];
        this._currentSnapshot = undefined;
        this.lagCompensator.init({
            gameWidth: initData.gameWidth,
            gameHeight: initData.gameHeight,
            paddleWidth: matchData.playerA.paddle.width,
            paddleHeight: matchData.playerA.paddle.height,
            aPaddleX: matchData.playerA.paddle.xPos,
            bPaddleX: matchData.playerB.paddle.xPos,
            ballRadius: matchData.ball.width / 2,
            heroInit: matchData.playerA.hero && matchData.playerB.hero
                        ? {
                            aHeroSprite: matchData.playerA.hero.sprite,
                            aHeroSpriteLow: matchData.playerA.hero.spriteLow,
                            bHeroSprite: matchData.playerB.hero.sprite,
                            bHeroSpriteLow: matchData.playerB.hero.spriteLow
                        } : undefined
        }, initData.role);
    }

    get size(): number {
        return (this._buffer.length);
    }

    getSnapshot(): IMatchData | undefined {    
        if (!this._buffer.length
                && this._auxBuffer.length)
            this._currentSnapshot = this._auxBuffer.shift();
        else if (this._buffer.length)
        {
            this._currentSnapshot = this._buffer.shift();
        }
        return (this._currentSnapshot ? Match.cloneMatchData(this._currentSnapshot)
                                        : undefined);
    }

    private _smoothValue(targetValue: number, previousValue: number,
                            step: number, totalSteps: number): number {
        const   diff: number = targetValue - previousValue;
        let     displacement;

        displacement = diff * (step / totalSteps);
        return (previousValue + displacement);
    }

    private _applyServerNonPosBallData(matchData: IMatchData): void {
        let ballX: number;
        let ballY: number;
        let when: number;
    
        for (const snapshot of this._auxBuffer)
        {
            ballX = snapshot.ball.xPos;
            ballY = snapshot.ball.yPos;
            when = snapshot.when;
            Match.copyMatchData(snapshot, matchData);
            snapshot.ball.xPos = ballX;
            snapshot.ball.yPos = ballY;
            snapshot.when = when;
        }
    }

    /*
    **  If there is a serverSnapshot, generates new snapshots based on it.
    **  Otherwise, generates new snapshots based on the buffer's snapshot,
    **  if any.
    */
    fill(matchData: IMatchData): void {
        if (this._currentSnapshot
                && this._currentSnapshot.when - matchData.when > 0)
        {
            this._applyServerNonPosBallData(matchData);
            return ;
        }
        this._buffer.push(matchData);
        this._auxBuffer = [];
    }

    autofill(): void {
        this._auxBuffer = [];
        if (this._buffer.length)
            this._auxBuffer.push(this._buffer[0]);
        else if (this._currentSnapshot)
            this._auxBuffer.push(this._currentSnapshot);
        else
            return ;
        this.lagCompensator.autoFill(this._auxBuffer);
    }

    input(paddleMove: number, heroMove: number,
            currentSnapshot: IMatchData | undefined): void {
        if (!currentSnapshot)
            return ;
        this.lagCompensator.input(this._buffer, paddleMove,
                                    heroMove, currentSnapshot);
    }

    empty(): void {
        this._buffer = [];
    }

}
