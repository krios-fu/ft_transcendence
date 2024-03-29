import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { GameMatchmakingService } from "./game.matchmaking.service";
import { SocketHelper } from "./game.socket.helper";
import { GameUpdateService } from "./game.updateService";
import { UserRolesService } from "src/user_roles/user_roles.service";
import { UserRolesEntity } from "src/user_roles/entity/user_roles.entity";

@Injectable()
export class    GameSocketAuthService {

    private _authTimeout: Map<string, NodeJS.Timeout>;

    constructor(
        private readonly socketHelper: SocketHelper,
        private readonly updateService: GameUpdateService,
        private readonly matchMakingService: GameMatchmakingService,
        private readonly userRolesService: UserRolesService
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
        let     username: string = "";

        for (const room of rooms)
        {
            username = SocketHelper.getUserNameFromRoomName(room);
            if (username)
                break ;
        }
        return (username);
    }

    async registerUser(client: Socket, username: string): Promise<void> {
        const   currentUsername: string = this._getCurrentUser(client);
        let     roles: string[];
    
        if (currentUsername)
        {
            if (currentUsername === username)
                return ;
            else
                await this.removeUser(client, username);
        }
        roles = (await this.userRolesService
            .getAllRolesFromUsername(username))
            .map((userRole: UserRolesEntity) => userRole.role.role);
        client.data.globalRoles = roles;
        await client.join(SocketHelper.getUserRoomName(username));
    }

    private async _removePlayer(playerRoom: string): Promise<void> {
        const   roomId: string = playerRoom.slice(0, playerRoom.indexOf('-'));
    
        /*
        **  Checking for > 1, because socket has not left the room yet,
        **  and there might be other sockets associated to the same user
        **  in the room.
        **  socket.io Event "disconnecting".
        */
        if (await this.socketHelper.roomSocketLength(playerRoom) >= 1)
            return ;
        await this.updateService.playerWithdrawal(roomId, playerRoom);
    }

    // Not leaving default room in case it is not disconnected
    async removeUser(client: Socket, username: string): Promise<void> {
        const   rooms: IterableIterator<string> = client.rooms.values();
    
        await this.matchMakingService.removeFromAllQueues(username);
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
