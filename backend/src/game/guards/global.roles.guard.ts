import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {WsArgumentsHost} from "@nestjs/common/interfaces";
import {UnauthorizedWsException} from "../exceptions/unauthorized.wsException";
import {ForbiddenWsException} from "../exceptions/forbidden.wsException";
import { Socket } from "socket.io";


@Injectable()
export class GlobalRolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

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

    private async _getRoles(wsCtx: WsArgumentsHost, handlerName: string): Promise<string[]> {
        const client: Socket = wsCtx.getClient<Socket>();
        let   roles: string[] = client.data.globalRoles;

        if (!roles && handlerName !== 'authentication') {
            throw new UnauthorizedWsException(
                handlerName,
                wsCtx.getData()
            );
        }
        return roles;
    }

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const wsCtx: WsArgumentsHost = ctx.switchToWs();
        const handlerName: string = ctx.getHandler().name;
        const requiredRoles: string[] = this.reflector.get<string[]>(
            'requiredRoles',
            ctx.getHandler()
        );
        const forbiddenRoles: string[] = this.reflector.get<string[]>(
            'forbiddenRoles',
            ctx.getHandler()
        )
        let roles: string[];
        const { token, username, id } = wsCtx.getClient<Socket>().data;

        if (!token || !username || !id) {
            if (handlerName === 'authentication') {
                return true;
            } else {
                throw new UnauthorizedWsException(
                    handlerName,
                    wsCtx.getData()
                );
            }
        }
        roles = await this._getRoles(wsCtx, handlerName);
        if (!this._compliesWithRequiredRoles(requiredRoles, roles) ||
            !this._compliesWithForbiddenRoles(forbiddenRoles, roles)) {
            throw new ForbiddenWsException(
                handlerName,
                {'forbiddenCtx': 'global'}
            )
        }
        return true;
    }
}