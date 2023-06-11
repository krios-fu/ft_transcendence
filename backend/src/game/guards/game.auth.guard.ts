import {
    CanActivate,
    ExecutionContext,
    Injectable
} from "@nestjs/common";
import { WsArgumentsHost } from "@nestjs/common/interfaces";
import { Observable } from "rxjs";
import { Socket } from "socket.io";
import { AuthService } from "src/auth/auth.service";
import { IJwtPayload } from "src/common/interfaces/request-payload.interface";
import { BadRequestWsException } from "../exceptions/badRequest.wsException";
import { UnauthorizedWsException } from "../exceptions/unauthorized.wsException";
import { GameSocketAuthService } from "../game.socketAuth.service";
import { EncryptionService } from "src/auth/service/encryption.service";
import { ForbiddenWsException } from "../exceptions/forbidden.wsException";

@Injectable()
export class    GameAuthGuard implements CanActivate {

    constructor(
        private readonly authService: AuthService,
        private readonly socketAuthService: GameSocketAuthService,
        private readonly encryptionService: EncryptionService
    ) {}

    private _getToken(client: Socket, handlerName: string,
                        ctx: WsArgumentsHost): string {
        let token: any;
    
        if (handlerName === "authentication")
        {
            token = ctx.getData();
            if (!token || typeof token != "string")
                return ("");
            token = this.encryptionService.decrypt(token);
        }
        else
        {
            token = client.data.token;
            if (!token)
                return ("");
        }
        return (token);
    }

    // Validate JWT token and inject token and username into client.
    private _identifyUser(client: Socket, handlerName: string,
                            token: string): boolean {
        let payload: IJwtPayload | undefined;
    
        payload = this.authService.validateJWToken(token);
        if (!payload)
            return (false);
        if (!client.data.token
                || handlerName === "authentication")
            client.data.token = token;
        client.data.username = payload.data.username;
        return (true);
    }

    canActivate(context: ExecutionContext)
                    : boolean | Promise<boolean> | Observable<boolean> {
        const   wsContext: WsArgumentsHost = context.switchToWs();
        const   client: Socket = wsContext.getClient<Socket>();
        const   handlerName: string = context.getHandler().name;
        const   token: string = this._getToken(client, handlerName, wsContext);
    
        /* *** role checking guard *** */
        console.log(`[ ON GAME.AUTH.GUARD ] ${handlerName}`);
        console.log(`[ GAME.AUTH.GUARD ] data obj. received: ${JSON.stringify(client.data.roles, null, 2)}`);
        if (handlerName === 'authentication') {
            console.log('[ ON GAME.AUTH.GUARD ] ok');
        }
        if (handlerName !== 'authentication' &&
            !client.data.roles['global']) {
            throw new UnauthorizedWsException(
                handlerName,
                wsContext.getData()
            );
        }
        if (client.data.roles['global'].includes('banned')) {
            throw new ForbiddenWsException(
                handlerName,
                wsContext.getData()
            )
        }
        /* ... */
        if (!token)
        {
            this.socketAuthService.addAuthTimeout(client);
            throw new BadRequestWsException(
                handlerName, //Handlers must have same name as event
                wsContext.getData()
            );
        }
        if (!this._identifyUser(client, handlerName, token))
        {
            this.socketAuthService.addAuthTimeout(client);
            throw new UnauthorizedWsException(
                handlerName, //Handlers must have same name as event
                wsContext.getData()
            );
        }
        return (true);
    }

}
