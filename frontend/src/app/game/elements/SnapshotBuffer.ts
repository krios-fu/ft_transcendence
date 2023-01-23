import {
    IMatchData,
    IMatchInitData
} from "./Match";
import { LagCompensationService } from "../services/lag-compensation.service";

export class   SnapshotBuffer {

    private _buffer: IMatchData[];

    constructor(
        gameWidth: number,
        gameHeight: number,
        initData: IMatchInitData,
        private readonly lagCompensator: LagCompensationService
    ) {
        this._buffer = [];
        this.lagCompensator.init({
            gameWidth: gameWidth,
            gameHeight: gameHeight,
            paddleWidth: initData.playerA.paddle.width,
            paddleHeight: initData.playerA.paddle.height,
            aPaddleX: initData.playerA.paddle.xPos,
            bPaddleX: initData.playerB.paddle.xPos,
            ballRadius: initData.ball.width / 2,
            heroInit: initData.playerA.hero && initData.playerB.hero
                        ? {
                            aHeroSprite: initData.playerA.hero.sprite,
                            aHeroSpriteLow: initData.playerA.hero.spriteLow,
                            bHeroSprite: initData.playerB.hero.sprite,
                            bHeroSpriteLow: initData.playerB.hero.spriteLow
                        } : undefined
        });
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

}
