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
        });
    }

    get size(): number {
        return (this._buffer.length);
    }

    getSnapshot(): IMatchData | undefined {
        return (this._buffer.shift());
    }

    autofill(): void {
        this.lagCompensator.autoFill(this._buffer);
    }

    /*
    **  Generates new snapshots based on the snapshot received
    **  from the server.
    */
    update(serverSnapshot: IMatchData, currentSnapshot: IMatchData): void {
        this.lagCompensator.serverUpdate(
            this._buffer,
            serverSnapshot,
            currentSnapshot
        );
    }

}
