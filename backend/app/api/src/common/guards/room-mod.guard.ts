import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserService } from "src/user/user.service";
import { UserRoomRolesService } from "src/user_room_roles/user_room_roles.service";

@Injectable()
export class RoomModGuard implements CanActivate {
    constructor(
        private readonly userService: UserService,
        private readonly userRoomRolesService: UserRoomRolesService,
    ) { }

    canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = ctx.switchToHttp().getRequest();
        const username = req.username;
        const roomId = (req.method === 'POST') ?
            Number(req.body['roomId']) :
            Number(req.param['room_id']);

        if (username === undefined || roomId !== roomId) {
            return false;
        }
        return this.validateRoomMod(username, roomId);
    }

    private async validateRoomMod(username: string, roomId: number): Promise<boolean> {
        const userId = await this.userService.findOneByUsername(username);
        if (userId === undefined) {
            return false;
        }
        /* this.userRoomRolesService. */
        return true; /* no */
    }
}