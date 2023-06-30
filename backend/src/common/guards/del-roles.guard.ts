import {UserRoomRolesService} from "../../user_room_roles/user_room_roles.service";
import {BanService} from "../../ban/ban.service";
import {UserRolesService} from "../../user_roles/user_roles.service";
import {UserRoomRolesEntity} from "../../user_room_roles/entity/user_room_roles.entity";
import {RolesService} from "../../roles/roles.service";

@Injectable()
export class DelRolesGuard implements canActivate {
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
        const roleId: number = req.param?.roleId;
        const username: string = req.user?.data?.username;
        const roles: string[]  = this.reflector.get<string[]>('allowedRoles');
        let   role: UserRoomRolesEntity;

        if (!userId || !roleId) {
            throw new UnauthorizedException();
        }
        role = await this.roomRolesService.findRole(id);
        if (!role){
            throw new BadRequestException();
        }
        if ((await this.rolesService.getOne()).role === 'admin' &&
            !roles.includes('admin')) {
            throw new ForbiddenException();
        }
        if (await this.banService.findOneByIds(userId, roomId) ||
            (!await this.globalRolesService.validateGlobalRole(username, ['super-admin']) &&
                !await this.roomRolesService.validateUserAction(userId, roomId, roles))) {
            throw new ForbiddenException();
        }
        return true;
    }
}