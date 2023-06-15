import {CanActivate, ExecutionContext} from "@nestjs/common";
import {Observable} from "rxjs";
import {Reflector} from "@nestjs/core";
import {WsArgumentsHost} from "@nestjs/common/interfaces";

export class GameRolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }
    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const wsCtx: WsArgumentsHost = context.switchToWs();
        const data: any = wsCtx.getData<any>();
        const cli = wsCtx.getClient()
        const cli_data = cli.data;

        console.log(`DATA FROM CONTEXT: ${JSON.stringify(data, null, 2)}`);
        console.log(`DATA FROM CLIENT: ${JSON.stringify(cli_data, null, 2)}`);
        return true;

        const allowedRoles: string[] = this.reflector.get<string[]>(
            'roles',
            context.getHandler()
        );
        console.log(`CONTEXT DATA: ${allowedRoles}`)
        // required roles, unauthorized roles, double assertion
        return ();
    }
}