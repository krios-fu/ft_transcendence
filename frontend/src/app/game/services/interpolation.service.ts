import { Injectable } from "@angular/core";
import { IHeroData } from "../elements/Hero";
import {
    IMatchData,
    Match
} from "../elements/Match";
import { IPlayerData } from "../elements/Player";
import { IBuffers } from "../elements/SnapshotBuffer";

export interface    IInterpolationData {
    serverSnapshot: IMatchData;
    currentSnapshot: IMatchData;
    totalSnapshots: number;
    role: string; //PlayerA, PlayerB, Spectator
    slowDown: boolean;
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
    private readonly _snapshotInterval: number = 1000 / 60;

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
        if (refHero.xPos != baseHero.xPos
            && refHero.active)
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
        if (refHero.lowXPos != baseHero.lowXPos
            && refHero.active)
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
        const   targetTime = baseTime + (this._snapshotInterval * currentStep);
        
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
        const   snapshot: IMatchData = Match.cloneMatchData(refSnapshot);

        this._interpolateBall(snapshot, baseSnapshot, timeData);
        this._updatePlayer(snapshot.playerA, baseSnapshot.playerA,
                            timeData, "PlayerA", role);
        this._updatePlayer(snapshot.playerB, baseSnapshot.playerB,
                            timeData, "PlayerB", role);
        snapshot.when = timeData.target;
        return (snapshot);
    }

    private _updateSnapshot(baseSnapshot: IMatchData,
                                baseSmoothSnapshot: IMatchData,
                                genSnapshot: IMatchData): void {    
        Match.copyMatchData(baseSnapshot, genSnapshot);
        Match.copyMatchData(baseSmoothSnapshot, genSnapshot);
    }

    private _preventBallRecoil(buffers: IBuffers,
                                currentSnapshot: IMatchData,
                                generatedSnapshot: IMatchData,
                                index: number): boolean {
        if (
            (generatedSnapshot.ball.xVel > 0
                && currentSnapshot.ball.xPos > generatedSnapshot.ball.xPos)
            ||
            (generatedSnapshot.ball.xVel < 0
                && currentSnapshot.ball.xPos < generatedSnapshot.ball.xPos))
        {
            if (index < buffers.buffer.length)
                this._updateSnapshot(buffers.buffer[index], buffers.smoothBuffer[index], currentSnapshot);
            else
            {
                buffers.buffer.push(Match.cloneMatchData(currentSnapshot));
                buffers.smoothBuffer.push(Match.cloneMatchData(currentSnapshot));
            }
            return (true);
        }
        return (false);
    }

    private _adjustTime(genSnapshot: IMatchData,
                            serverSnapshot: IMatchData,
                            currentStep: number): void {
        let baseTime: number;
    
        if (serverSnapshot.ball.xVel != 0)
            return ;
        baseTime = serverSnapshot.when - this._serverUpdateInterval;
        genSnapshot.when = baseTime + (this._snapshotInterval * currentStep);
    }

    private _fillLoop(buffers: IBuffers, serverSnapshot: IMatchData,
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
            this._adjustTime(generatedSnapshot, serverSnapshot,
                                currentStep);
            if (this._preventBallRecoil(buffers, currentSnapshot,
                                            generatedSnapshot, i))
                break ;
            if (i < buffers.buffer.length)
            {
                this._updateSnapshot(buffers.buffer[i], buffers.smoothBuffer[i], generatedSnapshot);
            }
            else
            {
                buffers.buffer.push(Match.cloneMatchData(generatedSnapshot));
                buffers.smoothBuffer.push(Match.cloneMatchData(generatedSnapshot));
            }
        }
    }

    /*
    **  When called, the ball, and the rival player's paddle
    **  and hero might move backwards.
    **  The backwards movement will be proportional to the amount of lag.
    **
    **  TODO: Smooth ball slow down.
    */
    private _stopTime(buffers: IBuffers, serverSnapshot: IMatchData,
                        currentSnapshot: IMatchData, role: string): void {
        buffers.buffer.length = this._totalSnapshots;
        buffers.buffer.fill(Match.cloneMatchData(serverSnapshot));
        buffers.smoothBuffer.length = this._totalSnapshots;
        buffers.smoothBuffer.fill(Match.cloneMatchData(serverSnapshot));
        for (let i = 0; i < buffers.buffer.length; ++i)
        {
            if (role === "PlayerA")
            {
                buffers.buffer[i].playerA.paddleY = currentSnapshot.playerA.paddleY;
                buffers.smoothBuffer[i].playerA.paddleY = currentSnapshot.playerA.paddleY;
                if (currentSnapshot.playerA.hero)
                {
                    buffers.buffer[i].playerA.hero = {...currentSnapshot.playerA.hero};
                    buffers.smoothBuffer[i].playerA.hero = {...currentSnapshot.playerA.hero};
                }
            }
            else //For Spectators this method is not called
            {
                buffers.buffer[i].playerB.paddleY = currentSnapshot.playerB.paddleY;
                buffers.smoothBuffer[i].playerB.paddleY = currentSnapshot.playerB.paddleY;
                if (currentSnapshot.playerB.hero)
                {
                    buffers.buffer[i].playerB.hero = {...currentSnapshot.playerB.hero};
                    buffers.smoothBuffer[i].playerB.hero = {...currentSnapshot.playerB.hero};
                }
            }
        };
    }

    fillBuffer(buffers: IBuffers, data: IInterpolationData): void {    
        this._totalSnapshots = data.totalSnapshots;
        if (data.slowDown)
        {
            this._stopTime(buffers, data.serverSnapshot,
                            data.currentSnapshot, data.role);
        }
        else
        {
            this._fillLoop(buffers, data.serverSnapshot, data.currentSnapshot,
                            data.role);
        }
        while (buffers.buffer.length > this._totalSnapshots)
        {
            buffers.buffer.pop();
            buffers.smoothBuffer.pop();
        }
    }

}
