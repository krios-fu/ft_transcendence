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

export interface    IExtrapolImproveData {
    serverSnapshot: IMatchData;
    currentSnapshot: IMatchData;
    role: string;
    aggressive: boolean;
}

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
        const   genSnapshot: IMatchData = Match.cloneMatchData(refSnapshot);
        const   prediction: IPredictionOutput | undefined = this._extrapolate({
            fromTime: refSnapshot.when,
            toTime: targetTime,
            aPaddleY: refSnapshot.playerA.paddleY,
            bPaddleY: refSnapshot.playerB.paddleY,
            ball: refSnapshot.ball,
            aHero: refSnapshot.playerA.hero,
            bHero: refSnapshot.playerB.hero
        });

        if (!prediction)
            return (genSnapshot);
        genSnapshot.ball = {...prediction.ball};
        if (prediction.aHero)
            genSnapshot.playerA.hero = {...prediction.aHero};
        if (prediction.bHero)
            genSnapshot.playerB.hero = {...prediction.bHero};
        genSnapshot.when = targetTime;
        return (genSnapshot);
    }

    /*
    **  Called when the buffer has only one snapshot left and there is no data
    **  available from the server to generate interpolated or extrapolated
    **  snapshots with.
    */
    fillBuffer(buffer: IMatchData[], totalSnapshots: number): void {
        let generatedSnapshot: IMatchData;
        let refSnapshot: IMatchData;

        if (!buffer.length)
            return ;
        this._totalSnapshots = totalSnapshots;
        for (let i = 1; i < this._totalSnapshots; ++i)
        {
            refSnapshot = buffer[i - 1];
            generatedSnapshot = this._getSnapshot(
                refSnapshot,
                refSnapshot.when + this._snapshotInterval
            );
            buffer.push(Match.cloneMatchData(generatedSnapshot));
        }
    }

    private _improveSnapshot(base: IMatchData, generated: IMatchData,
                                role: string, aggressive: boolean): void {
        if (aggressive)
        {
            Match.copyMatchData(base, generated);
        }
        else
        {
            base.ball = {...generated.ball};
            base.playerA.paddleY = generated.playerA.paddleY;
            if (generated.playerA.hero)
                base.playerA.hero = {...generated.playerA.hero};
            base.playerB.paddleY = generated.playerB.paddleY;
            if (generated.playerB.hero)
                base.playerB.hero = {...generated.playerB.hero};
        }
    }

    /*
    **  Simulate ball and rival hero from Server state to current state
    **  based on both snapshot timestamps.
    */
    private _bringBallToCurrentTime(refSnapshot: IMatchData,
                                        currentSnapshot: IMatchData,
                                        role: string): void {
        const genSnapshot = this._getSnapshot(
            refSnapshot,
            currentSnapshot.when
        );
        refSnapshot.ball = {...genSnapshot.ball};
        refSnapshot.when = currentSnapshot.when;
        if (role === "PlayerA")
        {
            if (genSnapshot.playerB.hero)
                refSnapshot.playerB.hero = {...genSnapshot.playerB.hero};
        }
        else
        {
            if (genSnapshot.playerA.hero)
                refSnapshot.playerA.hero = {...genSnapshot.playerA.hero};
        }
    }

    private _setupPlayerData(refSnapshot: IMatchData,
                                currentSnapshot: IMatchData,
                                role: string): void {
        if (role === "Spectator")
            return ;
        this._bringBallToCurrentTime(refSnapshot, currentSnapshot, role);
        if (role === "PlayerA")
        {
            refSnapshot.playerA.paddleY = currentSnapshot.playerA.paddleY;
            if (currentSnapshot.playerA.hero)
                refSnapshot.playerA.hero = {...currentSnapshot.playerA.hero};
        }
        else if (role === "PlayerB")
        {
            refSnapshot.playerB.paddleY = currentSnapshot.playerB.paddleY;
            if (currentSnapshot.playerB.hero)
                refSnapshot.playerB.hero = {...currentSnapshot.playerB.hero};
        }
    }

    private getTargetTime(aggressive: boolean,
                            firstBufferTime: number/*,
                            serverTime: number*/): number {
        if (!aggressive)
            return (firstBufferTime);
        return (Date.now());
    }

    improveInterpol(buffer: IMatchData[], data: IExtrapolImproveData): void {
        let targetTime: number = this.getTargetTime(data.aggressive,
                                                    buffer[0].when/*,
                                                    data.serverSnapshot.when*/);
        let refSnapshot: IMatchData = Match.cloneMatchData(data.serverSnapshot);
        let genSnapshot: IMatchData;

        this._setupPlayerData(refSnapshot, data.currentSnapshot, data.role);
        /*
        **  The buffer is full, because it has been filled previously
        **  by the interpolation service.
        */
        buffer.forEach((snapshot: IMatchData) => {
            genSnapshot = this._getSnapshot(
                refSnapshot,
                targetTime ? targetTime : snapshot.when
            );
            this._improveSnapshot(snapshot, genSnapshot,
                                    data.role, data.aggressive);
            targetTime = data.aggressive
                            ? snapshot.when + this._snapshotInterval : 0;
            refSnapshot = snapshot;
        });
    }

    private _preserveUnpredictable(current: IMatchData,
                                    prediction: IMatchData,
                                    role: string): void {        
        current.ball = {...prediction.ball};
        if (role === "PlayerA")
        {
            current.playerA.paddleY = prediction.playerA.paddleY;
            if (prediction.playerA.hero)
                current.playerA.hero = {...prediction.playerA.hero};
        }
        else
        {
            current.playerB.paddleY = prediction.playerB.paddleY;
            if (prediction.playerB.hero)
                current.playerB.hero = {...prediction.playerB.hero};
        }
    }

    updateInput(buffer: IMatchData[], baseSnapshot: IMatchData,
                    totalSnapshots: number, role: string): void {
        let generatedSnapshot: IMatchData;
        let refSnapshot: IMatchData;

        this._totalSnapshots = totalSnapshots;
        refSnapshot = baseSnapshot;
        for (let i = 0; i < this._totalSnapshots; ++i)
        {
            generatedSnapshot = this._getSnapshot(
                refSnapshot,
                refSnapshot.when + this._snapshotInterval
            );
            if (i < buffer.length)
                this._preserveUnpredictable(buffer[i], generatedSnapshot, role);
            else
                buffer.push(Match.cloneMatchData(generatedSnapshot));
            refSnapshot = buffer[i];
        }
    }

}
