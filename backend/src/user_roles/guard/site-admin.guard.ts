/*
** Site admin guard: validates request if user making the petition
**   has in database an Admin role.
**
** Only needs access to logged username in request, then searchs for role
** in user_role table and tries to find an 'Admin' role, validates if true.
*/

import { 
    CanActivate, 
    ExecutionContext, 
    Injectable 
} from "@nestjs/common";
import { Observable } from "rxjs";
import { UserRolesService } from "src/user_roles/user_roles.service";
import { IRequestUser } from "src/common/interfaces/request-payload.interface";

@Injectable()
export class SiteAdminGuard implements CanActivate {
    constructor (
        private readonly userRolesService: UserRolesService,
    ) { }

    canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req: IRequestUser = ctx.switchToHttp().getRequest();
        const username: string | undefined = req.user?.data?.username;
        
        if (username === undefined) {
            return false;
        }
        return this.userRolesService.validateGlobalRole(username, ['admin']);
    }
}