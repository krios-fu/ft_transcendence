import { Injectable } from "@angular/core";
import { IHeroData } from "../elements/Hero";
import {
    IMatchData,
    Match
} from "../elements/Match";
import { IPlayerData } from "../elements/Player";

export interface    IInterpolationData {
    serverSnapshot: IMatchData;
    currentSnapshot: IMatchData;
    totalSnapshots: number;
    role: string; //PlayerA, PlayerB, Spectator
}

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

    private readonly _serverUpdateInterval: number = 1000 / 20;

    constructor() {
        this._totalSnapshots = 0;
    }

    private _interpolate(refPos: number, basePos: number,
                            timeData: IFixedTimeData): number {
        const   diffPos = refPos - basePos;
    
        if (!timeData.diff)
            return (refPos);
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
        if (timeData.diff >= timeData.target - timeData.base)
        {//Only interpolate for past paddle position not a future one
            refPlayer.paddleY = this._interpolate(
                refPlayer.paddleY,
                basePlayer.paddleY,
                timeData
            );
        }
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

    private _updatePlayer(genPlayerData: IPlayerData,
                            basePlayerData: IPlayerData,
                            timeData: IFixedTimeData,
                            player: string,
                            role: string): void {
        if (player != role)
        {
            this._interpolatePlayer(
                genPlayerData,
                basePlayerData,
                timeData
            );
        }
        else
        {
            /*
            **  Preserve self player's paddle & hero data because
            **  the information is more up to date than the server's.
            */
            genPlayerData.paddleY = basePlayerData.paddleY;
            if (basePlayerData.hero)
                genPlayerData.hero = {...basePlayerData.hero};
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
        const   targetTime = Math.round(baseTime + ((1000 / 60) * currentStep));
        
        return ({
            base: baseTime,
            diff: refTime - baseTime,
            target: targetTime
        });
    }

    private _generateSnapshot(refSnapshot: IMatchData,
                                baseSnapshot: IMatchData,
                                currentStep: number,
                                role: string): IMatchData {
        const   timeData: IFixedTimeData = this._getFixedTimeData(
            refSnapshot.when,
            baseSnapshot.when,
            currentStep
        );
        const   snapshot: IMatchData = Match.copyMatchData(refSnapshot);

        this._interpolateBall(snapshot, baseSnapshot, timeData);
        this._updatePlayer(snapshot.playerA, baseSnapshot.playerA,
                            timeData, "PlayerA", role);
        this._updatePlayer(snapshot.playerB, baseSnapshot.playerB,
                            timeData, "PlayerB", role);
        if (snapshot.ball.xVel != 0)
            snapshot.when = timeData.target;
        return (snapshot);
    }

    /*
    **  Updates the data that cannot be predicted, like the players' data,
    **  and the ball data after a ball serve.
    */
    private _updateSnapshot(baseSnapshot: IMatchData,
                                genSnapshot: IMatchData): void {
        if (baseSnapshot.ball.xVel != genSnapshot.ball.xVel)
            baseSnapshot.ball = genSnapshot.ball;
        baseSnapshot.playerA = genSnapshot.playerA;
        baseSnapshot.playerB = genSnapshot.playerB;
        baseSnapshot.when = genSnapshot.when;
    }

    private _fillLoop(buffer: IMatchData[], serverSnapshot: IMatchData,
                        currentSnapshot: IMatchData, role: string): void {
        let currentStep: number;
        let generatedSnapshot: IMatchData;

        for (let i = 0; i < this._totalSnapshots; ++i)
        {
            currentStep = i + 1;
            generatedSnapshot = this._generateSnapshot(
                serverSnapshot,
                currentSnapshot,
                currentStep,
                role
            );
            if (i < buffer.length)
                this._updateSnapshot(buffer[i], generatedSnapshot);
            else
                buffer.push(generatedSnapshot);
        }
    }

    private _stopTime(buffer: IMatchData[], serverSnapshot: IMatchData): void {
        buffer.length = 0;
        buffer.push(Match.copyMatchData(serverSnapshot));
    }

    fillBuffer(buffer: IMatchData[], data: IInterpolationData): void {
        const   timeOffset: number = data.serverSnapshot.when
                                        - data.currentSnapshot.when;
    
        this._totalSnapshots = data.totalSnapshots;
        this._fillLoop(buffer, data.serverSnapshot, data.currentSnapshot,
                        data.role);
        while (buffer.length > this._totalSnapshots)
            buffer.pop();
    }

}
