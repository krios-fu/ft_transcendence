import { Injectable } from "@angular/core";
import { IMatchData } from "../elements/Match";
import { ExtrapolationService } from "./extrapolation.service";
import { InterpolationService } from "./interpolation.service";
import { IPredictionInit } from "./prediction.service";

@Injectable({
    providedIn: 'root'
})
export class    LagCompensationService {

    private readonly _bufferSnapshots: number = 3;

    constructor(
        private readonly interpolService: InterpolationService,
        private readonly extrapolService: ExtrapolationService
    ) {}

    init(initData: IPredictionInit): void {
        this.extrapolService.init(initData);
    }

    autoFill(buffer: IMatchData[]): void {
        this.extrapolService.fillBuffer(buffer, this._bufferSnapshots);
    }

    serverUpdate(buffer: IMatchData[], serverSnapshot: IMatchData,
                    currentSnapshot: IMatchData): void {
        this.interpolService.fillBuffer(
            buffer,
            serverSnapshot,
            currentSnapshot,
            this._bufferSnapshots
        );
    }

}
