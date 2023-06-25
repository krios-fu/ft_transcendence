import { Injectable } from "@nestjs/common";
import {
    RemoteSocket,
    Socket
} from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SocketHelper } from "./game.socket.helper";
import { IReturnRoomTimeout } from "./interfaces/room.interfaces";
import { GameUpdateService } from "./game.updateService";
import { GameRole } from "./interfaces/msg.interfaces";
import { RoomService } from "src/room/room.service";

@Injectable()
export class    GameRoomService {

    private _returnTimeout: Map<string, IReturnRoomTimeout>;

    constructor(
        private readonly socketHelper: SocketHelper,
        private readonly updateService: GameUpdateService,
        private readonly roomService: RoomService
    ) {
        this._returnTimeout = new Map<string, IReturnRoomTimeout>;
    }

    private _deleteTimeout(username: string): void {
        const   timeoutData: IReturnRoomTimeout | undefined =
                    this._returnTimeout.get(username);
    
        if (timeoutData)
            clearTimeout(timeoutData.timeout);
        this._returnTimeout.delete(username);
    }

    private async   _addTimeout(username: string,
                                    roomId: string,
                                    playerRoom: string): Promise<void> {
        if (this._returnTimeout.get(username))
            return ;
        this._returnTimeout.set(
            username,
            {
                roomId: roomId,
                timeout: setTimeout(async () => {
                    this._deleteTimeout(username);
                    await this.updateService.playerWithdrawal(
                        roomId,
                        playerRoom
                    );
                }, 15000) // 15 seconds until disconnect
            }
        );
    }

    private _leaveRegularRooms(
                client: RemoteSocket<DefaultEventsMap, any>): void {
        const   rooms: Set<string> = client.rooms;
    
        for (const room of rooms)
        {
            if (room.includes("-User")
                    || room.includes("-Player")
                    || room === client.id)
                continue ;
            client.leave(room);
        }
    }

    private _returnHandler(username: string, roomId: string): void {
        const   timeoutData: IReturnRoomTimeout | undefined =
                        this._returnTimeout.get(username);
        
        if (!timeoutData
                || roomId != timeoutData.roomId)
            return ;
        this._deleteTimeout(username);
    }

    /*
    **  All user's client join the room in order to
    **  know through any user client, the rooms it has joined.
    */
    async join(client: Socket,
                username: string,
                roomId: string): Promise<void> {
        this._returnHandler(username, roomId);
        await client.join(roomId);
    }

    private _playerLeave(roomId: string, client: Socket): [boolean, string] {
        const   [playerRoom, role]: [string | undefined, GameRole] =
                                this.socketHelper.getClientRoomPlayer(client);
        
        if (!playerRoom
                || playerRoom != roomId)
            return ([false, ""]);
        return ([true, `${playerRoom}-${role}`]);
    }

    async leave(client: Socket, username: string,
                    roomId: string): Promise<void> {
        let     playerLeaveResult: [boolean, string];
    
        client.leave(roomId);
        playerLeaveResult = this._playerLeave(roomId, client);
        if (!playerLeaveResult[0])
            return ;
        await this._addTimeout(username, roomId, playerLeaveResult[1]);
        this.socketHelper.emitToRoom(
            SocketHelper.getUserRoomName(username),
            "playerExit",
            (await this.roomService.findOne(
                SocketHelper.roomNameToId(roomId)
            )).roomName
        );
    }

}
