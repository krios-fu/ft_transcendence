import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { IRequestUser } from "src/common/interfaces/request-payload.interface";
import { UserRolesService } from "src/user_roles/user_roles.service";
import { RoomRolesService } from "../room_roles.service";

/* move to controller logic */
Injectable()
export class PostRoomRoleGuard implements CanActivate {
    constructor(
        private readonly roomRolesService: RoomRolesService,
        private readonly userRoleService: UserRolesService,
    ) { }

    canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req: IRequestUser = ctx.switchToHttp().getRequest();
        const roomId: number | undefined = (req.method === 'POST') ?
            Number(req.body['roomId']) :
            Number(req.param['room_id']);
        const username: string | undefined = req.user?.data?.username;

        if (roomId === undefined) {
            return true
        }
        if (roomId !== roomId || username === undefined) {
            return false;
        }

    }
}