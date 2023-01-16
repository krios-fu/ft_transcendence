import {
    IMatchData,
    Match
} from "./Match";
import { LagCompensationService } from "../services/lag-compensation.service";

export class   SnapshotBuffer {

    private _buffer: IMatchData[];

    constructor(
        private readonly lagCompensator: LagCompensationService
    ) {
        this._buffer = [];
    }

    getSnapshot(): IMatchData | undefined {    
        return (this._buffer.shift());
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
