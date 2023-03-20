import {
    IMatchData,
    IMatchInitData
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

    constructor(
        initData: IBufferInit,
        private readonly lagCompensator: LagCompensationService
    ) {
        const   matchData: IMatchInitData = initData.matchData;
    
        this._buffer = [];
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
        return (this._buffer.shift());
    }

    /*
    **  If there is a serverSnapshot, generates new snapshots based on it.
    **  Otherwise, generates new snapshots based on the buffer's snapshot,
    **  if any.
    */
    fill(updateQueue: IMatchData[], currentSnapshot: IMatchData): void {
        const   serverSnapshot: IMatchData | undefined = updateQueue.shift();

        if (serverSnapshot)
        {
            this.lagCompensator.serverUpdate(
                this._buffer,
                serverSnapshot,
                currentSnapshot
            );
        }
        else
            this.lagCompensator.autoFill(this._buffer);
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
