import {
    CanActivate,
    ExecutionContext,
    Injectable
} from "@nestjs/common";
import { WsArgumentsHost } from "@nestjs/common/interfaces";
import { Observable } from "rxjs";
import { Socket } from "socket.io";
import { ForbiddenWsException } from "../exceptions/forbidden.wsException";
import { SocketHelper } from "../game.socket.helper";

@Injectable()
export class    GameRoomGuard implements CanActivate {

    constructor(
        private readonly socketHelper: SocketHelper
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
                            roomId: string): boolean {
        const   username: string = client.data.username;
    
        if (!roomId || typeof roomId != "string")
            return (false);
        if (handlerName === "joinRoom")
            return (this._checkRoomJoin(roomId, username));
        else
            return (this._checkClientInRoom(roomId, client));
    }

    canActivate(context: ExecutionContext)
                    : boolean | Promise<boolean> | Observable<boolean> {
        const   wsContext: WsArgumentsHost = context.switchToWs();
        const   client: Socket = wsContext.getClient<Socket>();
        const   data: any = wsContext.getData<any>();
        const   handlerName: string = context.getHandler().name;
    
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
