import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Observable} from "rxjs";
import {Reflector} from "@nestjs/core";
import {WsArgumentsHost} from "@nestjs/common/interfaces";
import { UnauthorizedWsException } from "../exceptions/unauthorized.wsException";


@Injectable()
export class GameRolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    private _compliesWithRequiredRoles(constrains: string[], roles: string[]): boolean {
        if (!constrains || !constrains.length) {
            return true;
        }
        return (roles.every(
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

    canActivate(
        ctx: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const wsCtx: WsArgumentsHost = ctx.switchToWs();
        const roomId: string = wsCtx.getData();
        const roles = wsCtx.getClient()
            .data[roomId];
        const requiredRoles: string[] = this.reflector.get<string[]>(
            'requiredRoles',
            ctx.getHandler()
        );
        const forbiddenRoles: string[] = this.reflector.get<string[]>(
            'forbiddenRoles',
            ctx.getHandler()
        );


        if (!roles) {
            throw new UnauthorizedWsException();
        }
        return (this._compliesWithRequiredRoles(requiredRoles, roles),
            this._compliesWithForbiddenRoles(forbiddenRoles, roles));
    }
}