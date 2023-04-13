import {
    CanActivate,
    ExecutionContext,
    Injectable
} from "@nestjs/common";
import { WsArgumentsHost } from "@nestjs/common/interfaces";
import { Socket } from "socket.io";
import { BadRequestWsException } from "../exceptions/badRequest.wsException";
import { ForbiddenWsException } from "../exceptions/forbidden.wsException";
import { GameMatchmakingService } from "../game.matchmaking.service";
import { SocketHelper } from "../game.socket.helper";
import { UserRoomService } from "src/user_room/user_room.service";
import { UserService } from "src/user/services/user.service";
import { UserEntity } from "src/user/entities/user.entity";
import { RoomEntity } from "src/room/entity/room.entity";
import { RoomService } from "src/room/room.service";

@Injectable()
export class    GameRoomGuard implements CanActivate {

    constructor(
        private readonly socketHelper: SocketHelper,
        private readonly matchMakingService: GameMatchmakingService,
        private readonly userService: UserService,
        private readonly roomService: RoomService,
        private readonly userRoomService: UserRoomService
    ) {}

    private _checkClientInRoom(roomId: string, client: Socket): boolean {
        if (!client.rooms.has(roomId)
                && this.socketHelper.getClientRoomPlayer(client)[0] != roomId)
            return (false);
        return (true);
    }

    private async _checkRoomJoin(roomId: string,
                                    username: string): Promise<boolean> {    
        try {
            const   userEntity: Promise<UserEntity> =
                            this.userService.findOneByUsername(username);
            const   roomEntity: Promise<RoomEntity> =
                            this.roomService.findByName(roomId);
        
            if (!await userEntity
                    || !await roomEntity
                    || !await this.userRoomService.findUserRoomIds(
                                                        (await userEntity).id,
                                                        (await roomEntity).id)
            )
                return (false);
        } catch (err: any) {
            console.error("Game room guard db error: ", err);
            return (false);
        }
        return (true);
    }

    private async _validateRoom(client: Socket, handlerName: string,
                            data: any): Promise<boolean> {
        const   username: string = client.data.username;
    
        if (handlerName === "joinRoom")
            return (await this._checkRoomJoin(data, username));
        else if (handlerName === "matchInviteResponse")
        {
            return (
                this.matchMakingService.isNextPlayer(
                    client.data.mockUser/*username*/, //Provisional
                    data.roomId
                )
            );
        }
        else
            return (this._checkClientInRoom(data, client));
    }

    private _validData(data: any, handlerName: string): boolean {
        if (!data)
            return (false);
        if (handlerName === "matchInviteResponse")
        {
            if (!data.roomId
                    || typeof data.roomId != "string")
                return (false);
            return (true); //There is a validation pipe afterwards
        }
        if (typeof data != "string")
            return (false);
        return (true);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const   wsContext: WsArgumentsHost = context.switchToWs();
        const   client: Socket = wsContext.getClient<Socket>();
        const   data: any = wsContext.getData<any>();
        const   handlerName: string = context.getHandler().name;
    
        if (!this._validData(data, handlerName))
        {
            throw new BadRequestWsException(
                handlerName, //Handlers must have same name as event
                data
            )
        }
        if (!await this._validateRoom(client, handlerName, data))
        {
            throw new ForbiddenWsException(
                handlerName, //Handlers must have same name as event
                data
            );
        }
        return (true);
    }

}
