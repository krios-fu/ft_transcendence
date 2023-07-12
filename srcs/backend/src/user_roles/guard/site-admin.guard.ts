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
import { UserRolesService } from "../../user_roles/user_roles.service";
import { IRequestUser } from "../../common/interfaces/request-payload.interface";
import { UserService } from "src/user/services/user.service";

@Injectable()
export class SiteAdminGuard implements CanActivate {
    constructor (
        private readonly userService: UserService
    ) { }

    async canActivate(ctx: ExecutionContext): Promise<boolean>{
        const req: IRequestUser = ctx.switchToHttp().getRequest();
        const username: string | undefined = req.user?.data?.username;

        
        if (!username) {
            return false;
        }
        return await this.userService.validateGlobalRole(username, ['super-admin', 'moderator']);
    }
}