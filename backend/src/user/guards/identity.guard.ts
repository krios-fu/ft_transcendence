/*
** Identity guard: validates request if user doing the petition is the same
**   as the user whose resources are being requested.
** 
** Needs logged username in request and a :user_id parameter 
** in requested uri to be present. Will search for user login in database
** and test if entity's matches with authenticated user.
*/

import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserService } from "src/user/services/user.service";

export class IdentityGuard implements CanActivate {
    constructor(
        private readonly userService: UserService,
    ) { }
    canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = ctx.switchToHttp().getRequest();

        return this.userService.validateIdentity(req);
    }
}