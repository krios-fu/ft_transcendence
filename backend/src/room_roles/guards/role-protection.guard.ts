import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserRolesService } from "src/user_roles/user_roles.service";
import { RoomRolesService } from "../room_roles.service";

Injectable()
export class RoleProtection implements CanActivate {
    constructor(
        private readonly roomRolesService: RoomRolesService,
        private readonly userRoleService: UserRolesService,
    ) { }

    canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = ctx.switchToHttp().getRequest();
        const roomId = (req.method === 'POST') ?
            Number(req.body['roomId']) :
            Number(req.param['room_id']);
        
        return true; /* no */
    }

    /* private async */
}