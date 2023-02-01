import { sortedIndexBy } from "lodash";
import { GameReconciliationService } from "../game.reconciliation.service";
import { GameUpdateService } from "../game.updateService";
import {
    IGameData,
    IInputData
} from "./Game";

export class    GameBuffer {

    private _snapshotBuffer: IGameData[];
    private _inputBuffer: IInputData[];

    constructor() {
        this._snapshotBuffer = [];
        this._inputBuffer = [];
    }

    get snapshots(): IGameData[] {
        return (this._snapshotBuffer);
    }

    get inputs(): IInputData[] {
        return (this._inputBuffer);
    }

    /*
    **  Preserve one snapshot more than the one that reaches
    **  the reconciliation time limit in order to be able to reconstruct
    **  it when reconciling.
    */
    addSnapshot(snapshot: IGameData): void {
        this._snapshotBuffer.push(snapshot);
        if (snapshot.when - this._snapshotBuffer[0].when
                > GameReconciliationService.timeLimit
                    + GameUpdateService.updateTimeInterval)
            this._snapshotBuffer.shift();
    }

    /*
    **  It must be called after addSnapshot, so that oldestSnapshot
    **  has already been updated and represents
    **  a correct input drop reference.
    */
    addInput(input: IInputData[], oldestSnapshot: IGameData): void {
        const   inputDropIndex: number = sortedIndexBy(this._inputBuffer, {
            when: oldestSnapshot.when
        } as IInputData, (elem) => {
            return (elem.when);
        });

        // Drop inputs that correspond to snapshots older than oldestSnapshot.
        if (inputDropIndex > 0)
            this._inputBuffer = this._inputBuffer.slice(inputDropIndex);
        for (let i = 0; i < input.length; ++i)
        {
            this._inputBuffer.push({...input[i]});
        }
    }    

}
