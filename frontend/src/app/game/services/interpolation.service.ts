import { Injectable } from "@angular/core";
import { IHeroData } from "../elements/Hero";
import {
    IMatchData,
    Match
} from "../elements/Match";
import { IPlayerData } from "../elements/Player";

interface   IFixedTimeData {
    base: number;
    diff: number; // refSnapshot.when - base
    target: number;
}

@Injectable ({
    providedIn: 'root'
})
export class   InterpolationService {

    /*
    **  Convenience variable for each call. Indicates the number of snapshots
    **  to generate and store in buffer.
    */
    private _totalSnapshots: number;

    private readonly _serverUpdateInterval: number = 1000 / 60;

    constructor() {
        this._totalSnapshots = 0;
    }

    private _interpolate(refPos: number, basePos: number,
                            timeData: IFixedTimeData): number {
        const   diffPos = refPos - basePos;
    
        // Linear Interpolation formula
        return (
            basePos
            + ((diffPos * (timeData.target - timeData.base)) / timeData.diff)
        );
    }

    private _interpolateHero(refHero: IHeroData, baseHero: IHeroData,
                                timeData: IFixedTimeData): void {
        if (refHero.xPos != baseHero.xPos)
        {
            refHero.xPos = this._interpolate(
                refHero.xPos,
                baseHero.xPos,
                timeData
            );
            refHero.yPos = this._interpolate(
                refHero.yPos,
                baseHero.yPos,
                timeData
            );
        }
        if (refHero.lowXPos != baseHero.lowXPos)
        {
            refHero.lowXPos = this._interpolate(
                refHero.lowXPos,
                baseHero.lowXPos,
                timeData
            );
            refHero.lowYPos = this._interpolate(
                refHero.lowYPos,
                baseHero.lowYPos,
                timeData
            );
        }
    }

    private _interpolatePlayer(refPlayer: IPlayerData,
                                basePlayer: IPlayerData,
                                timeData: IFixedTimeData): void {
        refPlayer.paddle.yPos = this._interpolate(
            refPlayer.paddle.yPos,
            basePlayer.paddle.yPos,
            timeData
        );
        if (refPlayer.hero
            && basePlayer.hero)
        {
            this._interpolateHero(
                refPlayer.hero,
                basePlayer.hero,
                timeData
            );
        }
    }

    private _interpolateBall(snapshot: IMatchData,
                                baseSnapshot: IMatchData,
                                timeData: IFixedTimeData): void {
        if (snapshot.ball.xVel === 0)
            return ;
        snapshot.ball.xPos = this._interpolate(
            snapshot.ball.xPos,
            baseSnapshot.ball.xPos,
            timeData
        );
        snapshot.ball.yPos = this._interpolate(
            snapshot.ball.yPos,
            baseSnapshot.ball.yPos,
            timeData
        );
    }

    private _getFixedTimeData(refTime: number, baseTime: number,
                                currentStep: number): IFixedTimeData {
        const   targetTime = baseTime + ((1000 / 60) * currentStep);
        
        return ({
            base: baseTime,
            diff: refTime - baseTime,
            target: targetTime
        });
    }

    private _generateSnapshot(refSnapshot: IMatchData,
                                baseSnapshot: IMatchData,
                                currentStep: number): IMatchData {
        const   timeData: IFixedTimeData = this._getFixedTimeData(
            refSnapshot.when,
            baseSnapshot.when,
            currentStep
        );
        const   snapshot: IMatchData = Match.copyMatchData(refSnapshot);

        this._interpolateBall(snapshot, baseSnapshot, timeData);
        this._interpolatePlayer(
            snapshot.playerA,
            baseSnapshot.playerA,
            timeData
        );
        this._interpolatePlayer(
            snapshot.playerB,
            baseSnapshot.playerB,
            timeData
        );
        if (snapshot.ball.xVel != 0)
            snapshot.when = timeData.target;
        return (snapshot);
    }

    private _fillLoop(buffer: IMatchData[], serverSnapshot: IMatchData,
                        currentSnapshot: IMatchData): void {
        let currentStep: number;
        let generatedSnapshot: IMatchData;

        for (let i = 0; i < this._totalSnapshots; ++i)
        {
            currentStep = i + 1;
            generatedSnapshot = this._generateSnapshot(
                serverSnapshot,
                currentSnapshot,
                currentStep
            );
            if (i < buffer.length)
                buffer[i] = Match.copyMatchData(generatedSnapshot);
            else
                buffer.push(Match.copyMatchData(generatedSnapshot));
        }
    }

    private _stopTime(buffer: IMatchData[], serverSnapshot: IMatchData): void {
        buffer.length = 0;
        buffer.push(Match.copyMatchData(serverSnapshot));
    }

    fillBuffer(buffer: IMatchData[], serverSnapshot: IMatchData,
                currentSnapshot: IMatchData, totalSnapshots: number): void {
        const   timeOffset: number = serverSnapshot.when - currentSnapshot.when;
    
        this._totalSnapshots = totalSnapshots;
        if (timeOffset < this._serverUpdateInterval)
            this._stopTime(buffer, serverSnapshot);
        else
        {
            this._fillLoop(buffer, serverSnapshot,
                            buffer[0] ? Match.copyMatchData(buffer[0])
                            : currentSnapshot); //Provisional
        }
        while (buffer.length > this._totalSnapshots)
            buffer.pop();
    }

}
