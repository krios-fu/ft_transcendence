import {
    CanActivate,
    ExecutionContext,
    Injectable
} from "@nestjs/common";
import { WsArgumentsHost } from "@nestjs/common/interfaces";
import { Observable } from "rxjs";
import { Socket } from "socket.io";
import { BadRequestWsException } from "../exceptions/badRequest.wsException";
import { ForbiddenWsException } from "../exceptions/forbidden.wsException";
import { GameMatchmakingService } from "../game.matchmaking.service";
import { SocketHelper } from "../game.socket.helper";

@Injectable()
export class    GameRoomGuard implements CanActivate {

    constructor(
        private readonly socketHelper: SocketHelper,
        private readonly matchMakingService: GameMatchmakingService
    ) {}

    private _checkClientInRoom(roomId: string, client: Socket): boolean {
        if (!client.rooms.has(roomId)
                && this.socketHelper.getClientRoomPlayer(client)[0] != roomId)
            return (false);
        return (true);
    }

    private _checkRoomJoin(roomId: string, username: string): boolean {
        //Get room from DB
        //Check user allowed in room from DB
        return (true);
    }

    private _validateRoom(client: Socket, handlerName: string,
                            data: any): boolean {
        const   username: string = client.data.username;
    
        if (handlerName === "joinRoom")
            return (this._checkRoomJoin(data, username));
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

    canActivate(context: ExecutionContext)
                    : boolean | Promise<boolean> | Observable<boolean> {
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
        if (!this._validateRoom(client, handlerName, data))
        {
            throw new ForbiddenWsException(
                handlerName, //Handlers must have same name as event
                data
            );
        }
        return (true);
    }

}
