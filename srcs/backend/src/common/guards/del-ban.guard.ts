import { UserRoomRolesService } from "../../user_room_roles/user_room_roles.service";
import { UserRolesService } from "../../user_roles/user_roles.service";
import { NotFoundException, CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IRequestUser } from "../interfaces/request-payload.interface";
import { UserService } from "src/user/services/user.service";
import { BanService } from "src/ban/ban.service";
import { BanEntity } from "src/ban/entity/ban.entity";

@Injectable()
export class DelBanGuard implements CanActivate {
    constructor(private readonly reflector: Reflector,
                private readonly banService: BanService,
                private readonly globalRolesService: UserRolesService,
                private readonly roomRolesService: UserRoomRolesService,
                private readonly userService: UserService) { }

    private async _extractRoomId(roleId: number): Promise<number> {
        const role: BanEntity = await this.banService.findOne(roleId);

        if (!role) {
            throw new NotFoundException();
        }
        return role.room.id;
    }

    private async _assertValidations(
        userId: number,
        roomId: number,
        username: string,
        roles: string[]
    ): Promise<boolean> {
        if (await this.userService.validateBanRole(userId, roomId)) {
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
        const roleId: number = Number(req.params?.id);
        const username: string = req.user?.data?.username;
        const roles: string[]  = this.reflector.get<string[]>(
            'allowedRoles',
            ctx.getHandler()
        );
        let   roomId: number;

        if (!userId || !roleId) {
            throw new UnauthorizedException();
        }
        roomId = await this._extractRoomId(roleId);
        return this._assertValidations(userId, roomId, username, roles);
    }
}