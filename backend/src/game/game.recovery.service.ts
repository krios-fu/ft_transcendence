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
    IMatchRecoverData,
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
                data: IMenuInit | IMatchRecoverData
                        | IGameResultData | undefined): boolean {
        return (
            (data as IMenuInit).selection !== undefined
        );
    }

    private _isMatch(
                data: IMenuInit | IMatchRecoverData
                        | IGameResultData | undefined): boolean {
        return (
            (data as IMatchRecoverData).matchData !== undefined
        );
    }

    private _getScene(data: IMenuInit | IMatchRecoverData
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
        const   [, player]: [string | undefined, GameRole | undefined] =
                    this.socketHelper.getClientRoomPlayer(client);
    
        return (player ? player : "Spectator");
    }

    private _getData(client: Socket, roomId: string): IMenuInit |
                                                        IMatchRecoverData |
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
            return ({
                role: this._getRole(client),
                matchData: data
            });
        }
        data = this.updateService.getGameResult(roomId);
        if (data)
        {
            return (data);
        }
        return (undefined);
    }

    recover(client: Socket, roomId: string): void {
        const   data: IMenuInit | IMatchRecoverData |
                        IGameResultData | undefined =
                    this._getData(client, roomId);
        const   scene: SceneId = this._getScene(data);
        
        client.emit("recoverData", {
            scene: scene,
            data: data
        } as IRecoverData);
    }

}
