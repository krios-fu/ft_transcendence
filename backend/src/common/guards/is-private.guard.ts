import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { RolesEntity } from "../../roles/entity/roles.entity";
import { RoomRolesService } from "../../room_roles/room_roles.service";
import { UserService } from "../../user/services/user.service";
@Injectable()
export class IsPrivate implements CanActivate {
    constructor(
        private readonly userService: UserService,
        private readonly roomRolesService: RoomRolesService,
    ) { }
    canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = ctx.switchToHttp().getRequest();
        const username = req.username;
        const roomId = (req.method === 'POST') ?
            Number(req.body['roomId']) :
            Number(req.param['room_id']);
        const password = req.body['password'];

        if (username === undefined || roomId !== roomId) {
            return false;
        }
        return this.validatePrivateRoom(username, roomId, password);
    }

    private async validatePrivateRoom(
        username: string, 
        roomId: number,
        password: string,
    ): Promise<boolean> {
        var hasAccess: boolean = false;
        const privateRole = (await this.roomRolesService.findRolesRoom(roomId))
            .filter((role: RolesEntity) => role.role === 'private');
        
        if (!privateRole.length) {
            return true;
        }
        const user = await this.userService.findOneByUsername(username);
        if (user === null) {
            return false;
        }
        

    }

    private 

}