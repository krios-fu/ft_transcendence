import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { RolesEntity } from "src/roles/entity/roles.entity";
import { RoomRolesService } from "src/room_roles/room_roles.service";

@Injectable()
export class IsPrivate implements CanActivate {
    constructor(
        private roomRolesService: RoomRolesService,
    ) { }
    canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = ctx.switchToHttp().getRequest();
        const username = req.username;
        const roomId = (req.method === 'POST') ?
            req.body['roomId'] :
            req.param['room_id'];

        if (username === undefined || roomId !== roomId) {
            return false;
        }
        return this.validatePrivateRoom(roomId);
    }

    private async validatePrivateRoom(roomId: number): Promise<boolean> {

        this.roomRolesService.findRolesRoom(roomId).then((roles: RolesEntity[]) => {
            /* filter role: if role is private: then check if body payload has password */
        })
    }

}