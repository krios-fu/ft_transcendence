import { Injectable } from "@angular/core";
import {
    IMatchData,
    Match
} from "../elements/Match";
import {
    IPredictionInit,
    IPredictionInput,
    IPredictionOutput,
    PredictionService
} from "./prediction.service";

@Injectable({
    providedIn: 'root'
})
export class    ExtrapolationService {

    /*
    **  Convenience variable for each call. Indicates the number of snapshots
    **  to generate and store in buffer.
    */
    private _totalSnapshots: number;

    private readonly _snapshotInterval: number = 1000 / 60;

    constructor(
        private readonly predictor: PredictionService
    ) {
        this._totalSnapshots = 0;
    }

    init(data: IPredictionInit): void {
        this.predictor.init(data);
    }

    private _extrapolate(
        data: IPredictionInput
    ): IPredictionOutput | undefined {
        return (
            this.predictor.getSnapshot(data)
        );
    }

    private _getSnapshot(refSnapshot: IMatchData,
                            targetTime: number): IMatchData {
        const   genSnapshot: IMatchData = Match.copyMatchData(refSnapshot);
        const   prediction: IPredictionOutput | undefined = this._extrapolate({
            fromTime: refSnapshot.when,
            toTime: targetTime,
            aPaddleY: refSnapshot.playerA.paddleY,
            bPaddleY: refSnapshot.playerB.paddleY,
            ball: refSnapshot.ball,
            aHero: genSnapshot.playerA.hero,
            bHero: genSnapshot.playerB.hero
        });

        if (!prediction)
            return (genSnapshot);
        genSnapshot.ball = prediction.ball;
        genSnapshot.when = targetTime;
        return (genSnapshot);
    }

    /*
    **  Called when the buffer has only one snapshot left and there is no data
    **  available from the server to generate interpolated or extrapolated
    **  snapshots with.
    */
    fillBuffer(buffer: IMatchData[], totalSnapshots: number): void {
        let     generatedSnapshot: IMatchData;
        let     refSnapshot: IMatchData;

        if (!buffer.length)
            return ;
        this._totalSnapshots = totalSnapshots;
        for (let i = 1; i < this._totalSnapshots; ++i)
        {
            refSnapshot = buffer[i - 1];
            generatedSnapshot = this._getSnapshot(
                refSnapshot,
                Math.round(refSnapshot.when + this._snapshotInterval)
            );
            buffer.push(generatedSnapshot);
        }
    }

}
