import { Injectable } from "@angular/core";
import { IMatchData } from "../elements/Match";
import { Paddle } from "../elements/Paddle";
import { IPlayerData } from "../elements/Player";
import { ExtrapolationService } from "./extrapolation.service";
import { HeroPredictionService } from "./hero-prediction.service";
import { InterpolationService } from "./interpolation.service";
import {
    IPredictionInit,
    PredictionService
} from "./prediction.service";

@Injectable({
    providedIn: 'root'
})
export class    LagCompensationService {

    private readonly _bufferSnapshots: number = 3;
    private readonly _snapshotInterval: number = 1000 / 60;

    private _role: string;
    private _gameHeight: number;

    constructor(
        private readonly interpolService: InterpolationService,
        private readonly extrapolService: ExtrapolationService
    ) {
        this._role = "";
        this._gameHeight = 0;
    }

    init(initData: IPredictionInit, role: string): void {
        this.extrapolService.init(initData);
        this._role = role;
        this._gameHeight = initData.gameHeight;
    }

    autoFill(buffer: IMatchData[]): void {
        this.extrapolService.fillBuffer(buffer, this._bufferSnapshots);
    }

    //false: normal, true: slow down
    private _interpolType(serverSnapshot: IMatchData,
                            currentSnapshot: IMatchData): boolean {
        if (currentSnapshot.when >= serverSnapshot.when)
        {
            if (this._role === "PlayerA"
                    && serverSnapshot.ball.xVel > 0)
            {
                if (serverSnapshot.playerA.hero)
                {
                    if (serverSnapshot.ball.xPos
                            > HeroPredictionService.aHeroEndX)
                        return (true);
                }
                else
                {
                    if (serverSnapshot.ball.xPos
                            > PredictionService.aPaddleRightBorder)
                        return (true);
                }
            }
            else if (this._role === "PlayerB"
                        && serverSnapshot.ball.xVel < 0)
            {
                if (serverSnapshot.playerB.hero)
                {
                    if (serverSnapshot.ball.xPos
                            < HeroPredictionService.bHeroEndX)
                        return (true);
                }
                else
                {
                    if (serverSnapshot.ball.xPos
                            < PredictionService.bPaddleLeftBorder)
                        return (true);
                }
            }
        }
        return (false);
    }

    //false: normal, true: aggressive
    private _extrapolType(serverSnapshot: IMatchData,
                            currentSnapshot: IMatchData): boolean {
        if (currentSnapshot.when
                + (this._snapshotInterval * this._bufferSnapshots)
                < serverSnapshot.when)
        {
            if (this._role === "PlayerA"
                    && serverSnapshot.ball.xVel < 0)
            {
                if (serverSnapshot.playerA.hero)
                {
                    if (serverSnapshot.ball.xPos
                            < HeroPredictionService.bHeroEndX)
                        return (true);
                }
                else
                {
                    if (serverSnapshot.ball.xPos
                            < PredictionService.bPaddleLeftBorder)
                        return (true);
                }
            }
            else if (this._role === "PlayerB"
                        && serverSnapshot.ball.xVel > 0)
            {
                if (serverSnapshot.playerB.hero)
                {
                    if (serverSnapshot.ball.xPos
                            > HeroPredictionService.aHeroEndX)
                        return (true);
                }
                else
                {
                    if (serverSnapshot.ball.xPos
                            > PredictionService.aPaddleRightBorder)
                        return (true);
                }
            }
        }
        return (false);
    }

    serverUpdate(buffer: IMatchData[], serverSnapshot: IMatchData,
                    currentSnapshot: IMatchData): void {
        this.interpolService.fillBuffer(buffer, {
            serverSnapshot: serverSnapshot,
            currentSnapshot: currentSnapshot,
            totalSnapshots: this._bufferSnapshots,
            role: this._role,
            slowDown: this._interpolType(serverSnapshot, currentSnapshot)
        });
        this.extrapolService.improveInterpol(buffer, {
            serverSnapshot: serverSnapshot,
            currentSnapshot: currentSnapshot,
            role: this._role,
            aggressive: this._extrapolType(serverSnapshot, currentSnapshot)
        });
    }

    private _inputPaddle(playerData: IPlayerData, move: number): void {
        if (!move)
            return ;
        playerData.paddleY = move === 1
                                ? Paddle.moveDown(playerData.paddleY,
                                                    this._gameHeight)
                                : Paddle.moveUp(playerData.paddleY);
    }

    private _inputHero(playerData: IPlayerData, move: number): void {
        if (!move || !playerData.hero || playerData.hero.pointInvocation
                || playerData.hero.active)
            return ;
        playerData.hero.active = move;
        playerData.hero.pointInvocation = true;
    }

    input(buffer: IMatchData[], paddleMove: number, heroMove: number,
            currentSnapshot: IMatchData): void {
        const   playerData: IPlayerData = this._role === "PlayerA"
                                            ? currentSnapshot.playerA
                                            : currentSnapshot.playerB;
    
        this._inputPaddle(playerData, paddleMove);
        this._inputHero(playerData, heroMove);
        this.extrapolService.updateInput(buffer, currentSnapshot,
                                            this._bufferSnapshots, this._role);
    }

}
