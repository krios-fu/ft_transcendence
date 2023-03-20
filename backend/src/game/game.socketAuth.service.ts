import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { GameMatchmakingService } from "./game.matchmaking.service";
import { SocketHelper } from "./game.socket.helper";
import { GameUpdateService } from "./game.updateService";

@Injectable()
export class    GameSocketAuthService {

    private _authTimeout: Map<string, NodeJS.Timeout>;
    private _mockUserNum: number = 1; //Provisional

    constructor(
        private readonly socketHelper: SocketHelper,
        private readonly updateService: GameUpdateService,
        private readonly matchMakingService: GameMatchmakingService
    ) {
        this._authTimeout = new Map<string, NodeJS.Timeout>;
    }

    addAuthTimeout(client: Socket): void {
        const   clientId: string = client.id;
    
        if (this._authTimeout.get(clientId))
            return ;
        this._authTimeout.set(
            clientId,
            setTimeout(() => {
                this.deleteTimeout(clientId);
                client.disconnect();
            }, 60000) // 1 minute until disconnect
        );
    }

    clearTimeout(clientId: string): void {
        const   timeout: NodeJS.Timeout | undefined =
                    this._authTimeout.get(clientId);
    
        if (!timeout)
            return ;
        clearTimeout(timeout);
        this._authTimeout.set(clientId, undefined);
    }

    deleteTimeout(clientId: string): void {
        const   timeout: NodeJS.Timeout | undefined =
                    this._authTimeout.get(clientId);
    
        if (timeout)
            clearTimeout(timeout);
        this._authTimeout.delete(clientId);
    }

    private _getCurrentUser(client: Socket): string {
        const   rooms: IterableIterator<string> = client.rooms.keys();
        const   userRoomSpecifier: string = "-User";
        let     username: string = "";

        for (const room of rooms)
        {
            if (room.endsWith(userRoomSpecifier))
            {
                username = room.slice(
                    0,
                    room.length - userRoomSpecifier.length
                );
                break ;
            }
        }
        return (username);
    }

    async registerUser(client: Socket, username: string): Promise<void> {
        const   currentUsername: string = this._getCurrentUser(client);
    
        if (currentUsername)
        {
            if (currentUsername === username)
                return ;
            else
                await this.removeUser(client, username);
        }
        client.emit("mockUser", {
            mockUser: `user-${this._mockUserNum}`
        }); //Provisional
        client.data.mockUser = `user-${this._mockUserNum}`; //Provisional
        client.join(`user-${this._mockUserNum}`); //Provisional
        client.join(`${username}-User`);
        console.log(
            `With id: ${client.id}, username ${username}-User`
            +
            `, and testing-username user-${this._mockUserNum}`
        );
        ++this._mockUserNum; //Provisional
    }

    private async _removePlayer(playerRoom: string): Promise<void> {
        const   roomId: string = playerRoom.slice(0, playerRoom.indexOf('-'));
    
        /*
        **  Checking for > 1, because socket has not left the room yet,
        **  and there might be other sockets associated to the same user
        **  in the room.
        **  socket.io Event "disconnecting".
        */
        if (await this.socketHelper.roomSocketLength(playerRoom) > 1)
            return ;
        await this.updateService.playerWithdrawal(roomId, playerRoom);
    }

    // Not leaving default room in case it is not disconnected
    async removeUser(client: Socket, username: string): Promise<void> {
        const   rooms: IterableIterator<string> = client.rooms.values();
    
        this.matchMakingService.removeFromAllQueues(username);
        for (const room of rooms)
        {
            if (room === client.id)
                continue ;
            else if (room.includes("Player"))
                await this._removePlayer(room);
            client.leave(room);
        }
    }

}
