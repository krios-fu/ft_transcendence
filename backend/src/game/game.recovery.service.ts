import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { IGameClientStart } from "./elements/Game";
import { IGameSelectionData } from "./elements/GameSelection";
import { SocketHelper } from "./game.socket.helper";
import {
    GameUpdateService,
    IGameResultData
} from "./game.updateService";

export type SceneId =
                | "start"
                | "menuClassic"
                | "menuHero"
                | "match"
                | "end";

export interface    IRecoverData {
    readonly scene: SceneId;
    readonly data:
                | IMenuInit
                | IGameClientStart
                | IGameResultData
                | undefined;
}

export interface    IMenuInit {
    hero: boolean;
    role: GameRole;
    selection: IGameSelectionData;
}

export type GameRole = "Spectator" | "PlayerA" | "PlayerB";

@Injectable()
export class    GameRecoveryService {

    constructor(
        private readonly updateService: GameUpdateService,
        private readonly socketHelper: SocketHelper
    ) {}

    private _isSelection(
                data: IMenuInit | IGameClientStart
                        | IGameResultData | undefined): boolean {
        return (
            (data as IMenuInit).selection !== undefined
        );
    }

    private _isMatch(
                data: IMenuInit | IGameClientStart
                        | IGameResultData | undefined): boolean {
        return (
            (data as IGameClientStart).ball !== undefined
        );
    }

    private _getScene(data: IMenuInit | IGameClientStart
                                | IGameResultData | undefined): SceneId {
        if (data === undefined)
            return ("start");
        if (this._isSelection(data))
        {
            if ((data as IMenuInit).hero === true)
                return ("menuHero")
            return ("menuClassic");
        }
        if (this._isMatch(data))
            return ("match");
        return ("end");
    }

    private _getRole(client: Socket): GameRole {
        const   [, player]: [string | undefined, any] =
                    this.socketHelper.getClientRoomPlayer(client); //Improve!! return GameRole or undefined in second value
        let     role: GameRole = "Spectator";

        if (player)
            role = player;
        return (role);
    }

    private _getData(client: Socket, roomId: string)
                : IMenuInit | IGameClientStart
                    | IGameResultData | undefined {
        let selectionData: IGameSelectionData;
        let matchData: IGameClientStart;
        let result: IGameResultData;

        selectionData = this.updateService.getGameSelectionData(roomId);
        if (selectionData)
        {
            return ({
                hero: selectionData.heroA != undefined,
                role: this._getRole(client),
                selection: selectionData
            });
        }
        matchData = this.updateService.getGameClientStartData(roomId);
        if (matchData)
        {
            return (matchData);
        }
        result = this.updateService.getGameResult(roomId);
        if (result)
        {
            return (result);
        }
        return (undefined);
    }

    recover(client: Socket, roomId: string): void {
        const   data: IMenuInit | IGameClientStart
                        | IGameResultData | undefined =
                    this._getData(client, roomId);
        const   scene: SceneId = this._getScene(data);
        
        client.emit("recoverData", {
            scene: scene,
            data: data
        } as IRecoverData);
    }

}
