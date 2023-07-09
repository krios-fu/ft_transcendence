import {UserRoomRolesService} from "../../user_room_roles/user_room_roles.service";
import {BanService} from "../../ban/ban.service";
import {UserRolesService} from "../../user_roles/user_roles.service";
import {UserRoomRolesEntity} from "../../user_room_roles/entity/user_room_roles.entity";
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IRequestUser } from "../interfaces/request-payload.interface";
import { UserService } from "src/user/services/user.service";

@Injectable()
export class DelRolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector,
                private readonly globalRolesService: UserRolesService,
                private readonly roomRolesService: UserRoomRolesService,
                private readonly userService: UserService) { }

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
        const roleId: number = Number(req.params?.roleId);
        const username: string = req.user?.data?.username;
        const roles: string[]  = this.reflector.get<string[]>(
            'allowedRoles',
            ctx.getHandler()
        );
        let   role: UserRoomRolesEntity;
        let   roomId: number;

        if (!userId || !roleId) {
            throw new UnauthorizedException();
        }
        role = await this.roomRolesService.findRole(roleId);
        if (!role){
            throw new BadRequestException();
        }
        roomId = role.userRoom.room.id;
        if (role.role.role === 'admin' &&
            !roles.includes('admin')) {
            throw new ForbiddenException();
        }
        return this._assertValidations(userId, roomId, username, roles);
    }
}