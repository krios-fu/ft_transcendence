import { Injectable } from "@nestjs/common";
import {
    RemoteSocket,
    Server,
    Socket
} from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { GameRole } from "./interfaces/msg.interfaces";
import { UserRolesEntity } from "src/user_roles/entity/user_roles.entity";
import { UserRolesService } from "src/user_roles/user_roles.service";
import { UserRoomRolesService } from "src/user_room_roles/user_room_roles.service";
import { BanService } from "src/ban/ban.service";
import { UserRoomRolesEntity } from "src/user_room_roles/entity/user_room_roles.entity";
import { BanEntity } from "src/ban/entity/ban.entity";
import { InternalServerErrorWsException } from "./exceptions/internalServerError.wsException";
import {UserService} from "../user/services/user.service";
import {UserEntity} from "../user/entities/user.entity";

type RoleCreds = {
    userId: number,
    roomId?: number
}

@Injectable()
export class    SocketHelper {

    private _server: Server;

    constructor(private readonly userService: UserService,
                private readonly urService: UserRolesService,
                private readonly urrService: UserRoomRolesService,
                private readonly banService: BanService) {
        this._server = undefined;
    }

    static roomIdToName(roomId: number): string {
        return (String(roomId));
    }

    static roomNameToId(roomName: string): number | undefined {
        const   roomId: number = Number(roomName);

        if (Number.isNaN(roomId))
            return (undefined);
        return (roomId);
    }

    static getUserRoomName(username: string): string {
        return (`${username}-User`);
    }

    static isUserRoomName(roomId: string): boolean {
        return (roomId.endsWith("-User"));
    }

    static getUserNameFromRoomName(roomId: string): string {
        const   userSpecifier: string = "-User";
    
        if (!roomId.endsWith(userSpecifier))
            return ("");
        return (
            roomId.slice(
                0,
                roomId.length - userSpecifier.length
            )
        );
    }

    initServer(server: Server): void {
        this._server = server;
    }



    async getAllUserClients(username: string)
                                    : Promise<RemoteSocket<DefaultEventsMap,
                                                any>[]> {
        return (
            await this._server.in(
                SocketHelper.getUserRoomName(username)
            ).fetchSockets()
        );
    }

    async addUserToRoom(username: string,
                            roomId: string): Promise<void> {
        let userSockets: RemoteSocket<DefaultEventsMap, any>[];

        userSockets = await this._server.in(
            SocketHelper.getUserRoomName(username)
        ).fetchSockets();
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
    getClientRoomPlayer(client: Socket): [string | undefined,
                                            GameRole | undefined] {
        const   rooms: IterableIterator<string> = client.rooms.keys();
        let     room: string | undefined = undefined;
        let     player: string | GameRole | undefined = undefined;
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
        return ([
            room,
            player != "PlayerA" && player != "PlayerB" ? undefined : player
        ]);
    }

    async roomSocketLength(roomId: string): Promise<number> {
        return (
            (await this._server.in(roomId).fetchSockets()).length
        );
    }

    // All user sockets should be in the same game room at once.
    async checkUserInRoom(username: string, roomId: string): Promise<boolean> {
        const   userRoom: string = SocketHelper.getUserRoomName(username);
        let     userSockets: RemoteSocket<DefaultEventsMap, any>[];

        userSockets = await this._server.in(userRoom).fetchSockets();
        if (!userSockets.length)
            return ;
        return (userSockets[0].rooms.has(roomId));
    }

    private async _refreshGlobalRoles(creds: RoleCreds, username: string) {
        const { userId } = creds;
        let query: UserRolesEntity[] = await this.urService.getAllRolesFromUser(userId);
        let roles: string[] = [];
        let userSockets: RemoteSocket<DefaultEventsMap, any[]>[] =
            await this.getAllUserClients(
                SocketHelper.getUserRoomName(username)
            );

        if (!query) {
            throw new InternalServerErrorWsException('none', null);
        }
        roles = query.map((ur: UserRolesEntity) => ur.role.role);
        for (let sck of userSockets) {
            sck.data['globalRoles'] = roles;
        }
    }

    private async _refreshRoomRoles(creds: RoleCreds, username: string): Promise<void> {
        const { userId, roomId } = creds;
        let query: UserRoomRolesEntity[] = 
            await this.urrService.getUserRolesInRoom(userId, roomId);
        let roles: string[] = [];
        let userSockets: RemoteSocket<DefaultEventsMap, any[]>[] =
            await this.getAllUserClients(
                SocketHelper.getUserRoomName(username)
            );
        let roomKey: string = SocketHelper.roomIdToName(roomId);

        if (!query) {
            throw new InternalServerErrorWsException('none', null);
        }
        roles = query.map((ur: UserRoomRolesEntity) => ur.role.role);
        for (let sck of userSockets) {
            if (!sck.data[roomKey]) {
                 sck.data[roomKey] = [];
            }
            sck.data[roomKey] = sck.data[roomKey].concat(roles).unique();
            sck.data[roomKey] = sck.data[roomKey]
                .filter((role: string) => roles.includes(role) || role === 'banned');
        }
    }

    private async _refreshBannedRoles(creds: RoleCreds, username: string): Promise<void> {
        const { userId, roomId } = creds;
        const banned: BanEntity | null = await this.banService.findOneByIds(userId, roomId);
        let userSockets: RemoteSocket<DefaultEventsMap, any[]>[] = 
            await this.getAllUserClients(
                SocketHelper.getUserRoomName(username)
            );
        let roomKey: string = SocketHelper.roomIdToName(roomId);

        for (let sck of userSockets) {
            if (!sck.data[roomKey]) {
                sck.data[roomKey] = [];
            }
            sck.data[roomKey] = sck.data[roomKey]
                .filter((role: string) => role != 'banned' || (role === 'banned' && (banned)));
            if (!sck.data[roomKey].includes('banned') && (banned)) {
                sck.data[roomKey].push('banned');
            }
        }
    }

    async refreshUserRoles(creds: RoleCreds,
                           ctxName: string): Promise<void> {
        const user: UserEntity = await this.userService.findOne(creds.userId);

        if (!user) {
            throw new InternalServerErrorWsException('none', null);
        }
        switch (ctxName) {
            case 'global':
                return this._refreshGlobalRoles(creds, user.username);
            case 'room':
                return this._refreshRoomRoles(creds, user.username);
            case 'banned':
                return this._refreshBannedRoles(creds, user.username);
            default:
                return ;
        }
    }
}
