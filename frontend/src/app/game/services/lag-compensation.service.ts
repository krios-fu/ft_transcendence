import { Injectable } from "@angular/core";
import { IMatchData } from "../elements/Match";
import { InterpolationService } from "./interpolation.service";

@Injectable({
    providedIn: 'root'
})
export class    LagCompensationService {

    private readonly _bufferSnapshots: number = 1;

    constructor(
        private readonly interpolService: InterpolationService
    ) {}

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
