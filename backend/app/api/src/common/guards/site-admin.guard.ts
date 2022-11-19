import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserEntity } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { UserRolesEntity } from "src/user_roles/entity/user_roles.entity";
import { UserRolesService } from "src/user_roles/user_roles.service";
import { IRequestUser } from "../interfaces/request-payload.interface";

@Injectable()
export class SiteAdminGuard implements CanActivate {
    constructor (
        private readonly userService: UserService,
        private readonly userRolesService: UserRolesService,
    ) { }

    canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req: IRequestUser = ctx.switchToHttp().getRequest();
        const username = req.username;

        if (username === null) {
            return false;    
        }
        return this.validateRole(username);
    }

    private async validateRole(username: string): Promise<boolean> {
        let isAdmin: boolean = false;

        this.userService.findOneByUsername(username).then(async (usr: UserEntity) => {
            this.userRolesService.getAllRolesFromUser(usr.id).then((usrRoles: UserRolesEntity[]) => {
                isAdmin = usrRoles.filter(usrRole => usrRole.role.role == 'admin').length > 0;
            });
        });
        return isAdmin;
    }
}