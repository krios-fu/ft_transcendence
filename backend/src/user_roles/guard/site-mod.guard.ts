/*
**  Site mod guard: validates request if user making petition
**    has at least a Mod role in database.
**
**  Must allow 'MOD' and 'ADMIN' role in application. 
*/

import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { IRequestUser } from "../../common/interfaces/request-payload.interface";
import { UserRolesService } from "../user_roles.service";

export class AtLeastSiteModGuard implements CanActivate {
    constructor (
        private readonly userRolesService: UserRolesService
    ) { }

    canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req: IRequestUser = ctx.switchToHttp().getRequest();
        const username: string | undefined = req.user?.data?.username;

        if (username === undefined) {
            return false;
        }
        return this.userRolesService.validateGlobalRole(username, ['admin', 'mod']);
    }
}