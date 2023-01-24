import { Injectable } from "@angular/core";
import { IMatchData } from "../elements/Match";
import { Paddle } from "../elements/Paddle";
import { IPlayerData } from "../elements/Player";
import { ExtrapolationService } from "./extrapolation.service";
import { InterpolationService } from "./interpolation.service";
import { IPredictionInit } from "./prediction.service";

@Injectable({
    providedIn: 'root'
})
export class    LagCompensationService {

    private readonly _bufferSnapshots: number = 3;

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

    serverUpdate(buffer: IMatchData[], serverSnapshot: IMatchData,
                    currentSnapshot: IMatchData): void {
        this.interpolService.fillBuffer(buffer, {
            serverSnapshot: serverSnapshot,
            currentSnapshot: currentSnapshot,
            totalSnapshots: this._bufferSnapshots,
            role: this._role
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
        playerData.hero.pointInvocation = false; //Leaving it false for testing
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
