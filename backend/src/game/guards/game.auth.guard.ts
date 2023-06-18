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
import { UserRolesEntity } from "src/user_roles/entity/user_roles.entity";
import { UserRolesService } from "src/user_roles/user_roles.service";

@Injectable()
export class    GameAuthGuard implements CanActivate {

    constructor(
        private readonly authService: AuthService,
        private readonly socketAuthService: GameSocketAuthService,
        private readonly encryptionService: EncryptionService,
        private readonly userRolesService: UserRolesService
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

    private async _getRoles(username: string): Promise<string[]> {
        let     roles: string[];
        
        roles = (await this.userRolesService.getAllRolesFromUsername(username))
            .map((ur: UserRolesEntity) => ur.role.role);
        if (!roles) {
            return undefined;
        }
        return roles;
    }

    // Validate JWT token and inject token and username into client.
    private async _identifyUser(client: Socket, handlerName: string,
                            token: string): Promise<boolean> {
        let payload: IJwtPayload | undefined;
        let roles: string[] | undefined = client.data.globalRoles;
    
        payload = this.authService.validateJWToken(token);
        if (!payload)
            return (false);
        if (!client.data.token || handlerName == "authentication") {
            roles = await this._getRoles(payload.data.username);
            if (!roles) {
                return (false);
            }
            client.data.id = payload.data.id;
            client.data.token = token;
            client.data.globalRoles = roles;
        }
        if (handlerName != "authentication" && !roles) {
            return (false);
        }
        client.data.username = payload.data.username;
        return (true);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const   wsContext: WsArgumentsHost = context.switchToWs();
        const   client: Socket = wsContext.getClient<Socket>();
        const   handlerName: string = context.getHandler().name;
        const   token: string = this._getToken(client, handlerName, wsContext);

        if (!token)
        {
            this.socketAuthService.addAuthTimeout(client);
            throw new BadRequestWsException(
                handlerName, //Handlers must have same name as event
                wsContext.getData()
            );
        }
        if (!(await this._identifyUser(client, handlerName, token)))
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
