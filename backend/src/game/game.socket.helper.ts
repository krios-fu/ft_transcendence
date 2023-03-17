import { Injectable } from "@nestjs/common";
import {
    RemoteSocket,
    Server,
    Socket
} from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

@Injectable()
export class    SocketHelper {

    private _server: Server;

    constructor() {
        this._server = undefined;
    }

    initServer(server: Server): void {
        this._server = server;
    }

    async addUserToRoom(username: string,
                            roomId: string): Promise<void> {
        let userSockets: RemoteSocket<DefaultEventsMap, any>[];

        userSockets = await this._server.in(username).fetchSockets();
        userSockets.forEach((sock) => {
            sock.join(roomId);
        });
    }

    emitToRoom(roomId: string, eventId: string, data: any = null): void {
        this._server.to(roomId).emit(eventId, data);
        return ;
    }

    async clearRoom(roomId: string): Promise<void> {
        let roomSockets: RemoteSocket<DefaultEventsMap, any>[];

        roomSockets = await this._server.in(roomId).fetchSockets();
        roomSockets.forEach((sock) => {
            sock.leave(roomId);
        });
    }

    /*
    **  client.rooms returns a Set with the socket id as first element,
    **  and the next ones, the ids of the rooms it is currently in.
    */
    getClientRoomPlayer(client: Socket): [string, string] {
        const   rooms: IterableIterator<string> = client.rooms.keys();
        let     room: string = undefined;
        let     player: string = undefined;
        let     separatorPosition: number;

        for (const r of rooms)
        {
            if (r.includes("-Player"))
            {
                separatorPosition = r.indexOf('-');
                room = r.slice(0, separatorPosition);
                player = r.slice(separatorPosition + 1);
                break ;
            }
        }
        return ([room, player]);
    }

    async roomSocketLength(roomId: string): Promise<number> {
        return (
            (await this._server.in(roomId).fetchSockets()).length
        );
    }

}
