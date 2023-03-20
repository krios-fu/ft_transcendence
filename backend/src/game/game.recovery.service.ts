import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { IGameClientStart } from "./elements/Game";
import { IGameSelectionData } from "./elements/GameSelection";
import { SocketHelper } from "./game.socket.helper";
import {
    GameUpdateService,
    IGameResultData
} from "./game.updateService";
import {
    GameRole,
    IMenuInit
} from "./interfaces/msg.interfaces";

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
            if ((data as IMenuInit).selection.heroA)
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

    private _getData(client: Socket, roomId: string): IMenuInit |
                                                        IGameClientStart |
                                                        IGameResultData |
                                                        undefined {
        let data: IGameSelectionData | IGameClientStart | IGameResultData;

        data = this.updateService.getGameSelectionData(roomId);
        if (data)
        {
            return ({
                role: this._getRole(client),
                selection: data
            });
        }
        data = this.updateService.getGameClientStartData(roomId);
        if (data)
        {
            return (data);
        }
        data = this.updateService.getGameResult(roomId);
        if (data)
        {
            return (data);
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
