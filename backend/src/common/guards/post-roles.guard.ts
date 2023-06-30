import {UserRoomRolesService} from "../../user_room_roles/user_room_roles.service";
import {BanService} from "../../ban/ban.service";
import {RoomService} from "../../room/room.service";
import {UserRolesService} from "../../user_roles/user_roles.service";
import {RolesService} from "../../roles/roles.service";
import {ForbiddenWsException} from "../../game/exceptions/forbidden.wsException";

@Injectable()
export class PostRolesGuard implements canActivate {
    constructor(private readonly reflector: Reflector,
                private readonly globalRolesService: UserRolesService,
                private readonly roomRolesService: UserRoomRolesService,
                private readonly rolesService: RolesService,
                private readonly banService: BanService) { }
    private async _assertValidations(
        userId: number,
        roomId: number,
        username: string,
        roles: string[]
    ): Promise<boolean> {
        if (await this.banService.findOneByIds(userId, roomId)) {
            throw new ForbiddenException('user has been banned form the room');
        }
        if (!roles.length) {
            return true;
        }
        if (!await this.globalRolesService.validateGlobalRole(username, ['super-admin']) &&
            !await this.roomRolesService.validateUserAction(userId, roomId, roles)) {
            throw new ForbiddenException();
        }
        return true;
    }
    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req: IRequestUser = ctx.switchToHttp().getRequest();
        const userId: number = req.user?.data?.id;
        const roomId: number = req.body?.roomId;
        const roleId: number = req.body?.roleId;
        const username: string = req.user?.data?.username;
        const roles: string[]  = this.reflector.get<string[]>('allowedRoles');

        if (!userId || !roomId) {
            throw new UnauthorizedException();
        }
        if ((await this.rolesService.getOne()).role === 'admin' &&
            !roles.includes('admin')) {
            throw new ForbiddenException();
        }
        return this._assertValidations(userId, roomId, username, roles);
    }
}