import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {WsArgumentsHost} from "@nestjs/common/interfaces";
import {ForbiddenWsException} from "../exceptions/forbidden.wsException";
import { Socket } from "socket.io";


@Injectable()
export class GameRolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    private _authRoomRoles(cli: Socket, roomId: string): void {
        if (!cli.data[roomId]) {
            cli.data[roomId] = [];
        }
    }

    private _compliesWithRequiredRoles(constrains: string[], roles: string[]): boolean {
        if (!constrains || !constrains.length) {
            return true;
        }
        return (roles.length && roles.every(
            (role: string) => constrains.includes(role)
        ));
    }

    private _compliesWithForbiddenRoles(constrains: string[], roles: string[]): boolean {
        if (!constrains || !constrains.length) {
            return true;
        }
        return !(roles.some(
            (role: string) => constrains.includes(role)
        ));
    }

    canActivate(ctx: ExecutionContext): boolean{
        const wsCtx: WsArgumentsHost = ctx.switchToWs();
        const roomId: string = wsCtx.getData();
        const handlerName: string = ctx.getHandler().name;
        const requiredRoles: string[] = this.reflector.get<string[]>(
            'requiredRoles',
            ctx.getHandler()
        );
        const forbiddenRoles: string[] = this.reflector.get<string[]>(
            'forbiddenRoles',
            ctx.getHandler()
        );

        this._authRoomRoles(wsCtx.getClient<Socket>(), roomId);
        const roles: string[] = wsCtx.getClient()
            .data[roomId];

        console.log(`My roles: ${JSON.stringify(roles, null, 2)}`);
        console.log(`Required roles: ${JSON.stringify(requiredRoles, null, 2)}`);
        console.log(`Forbidden roles: ${JSON.stringify(forbiddenRoles, null, 2)}`)

        if (!this._compliesWithRequiredRoles(requiredRoles, roles) ||
            !this._compliesWithForbiddenRoles(forbiddenRoles, roles)) {
            throw new ForbiddenWsException(
                handlerName,
                wsCtx.getData()
            )
        }
        return true;
    }
}