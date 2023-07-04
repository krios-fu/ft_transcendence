import {UserRoomRolesService} from "../../user_room_roles/user_room_roles.service";
import {UserRolesService} from "../../user_roles/user_roles.service";
import {RolesService} from "../../roles/roles.service";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IRequestUser } from "../interfaces/request-payload.interface";
import { UserService } from "src/user/services/user.service";

@Injectable()
export class PostBanGuard implements CanActivate {
    constructor(private readonly reflector: Reflector,
                private readonly userService: UserService,
                private readonly globalRolesService: UserRolesService,
                private readonly roomRolesService: UserRoomRolesService,
                private readonly rolesService: RolesService) { }

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
        const roomId: number = req.body?.roomId
        const roleId: number = req.body?.roleId;
        const username: string = req.user?.data?.username;
        const roles: string[]  = this.reflector.get<string[]>(
            'allowedRoles',
            ctx.getHandler()
        );

        if (!userId || !roomId) {
            throw new UnauthorizedException();
        }
        return this._assertValidations(userId, roomId, username, roles);
    }
}