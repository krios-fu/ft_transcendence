import { Injectable } from "@nestjs/common";
import { RemoteSocket, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SocketHelper } from "./game.socket.helper";

@Injectable()
export class    GameRoomService {

    constructor(
        private readonly socketHelper: SocketHelper
    ) {}

    private _leaveRegularRooms(
                client: RemoteSocket<DefaultEventsMap, any>): void {
        const   rooms: Set<string> = client.rooms;
    
        for (const room of rooms)
        {
            if (room.includes("-User")
                    || room.includes("Player")
                    || room === client.id)
                continue ;
            client.leave(room);
        }
    }

    /*
    **  All user's client join the room in order to
    **  know through any user client, the rooms it has joined.
    */
    async join(username: string,
                roomId: string): Promise<void> {
        const   clients = await this.socketHelper.getAllUserClients(username);
    
        for (const client of clients)
        {
            this._leaveRegularRooms(client);
        }
        await this.socketHelper.addUserToRoom(username, roomId);
    }


    async leave(username: string, roomId: string): Promise<void> {
        const   clients = await this.socketHelper.getAllUserClients(username);
    
        for (const client of clients)
        {
            client.leave(roomId);
        }
    }

}
