import { Body, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { Roles } from 'src/room/roles.enum';
import { RoleInfoDto } from '../dto/role-info.dto';
import { RoomService } from '../room.service';

@Injectable()
export class RoomRolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly roomService: RoomService,
  ) { }

    canActivate(
        ctxt: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const allowedRole = this.reflector.get<Roles>(ROLES_KEY, ctxt.getHandler());
        const req = ctxt.switchToHttp().getRequest<Request>();
        const bodyDto = req.body as any;

        return this.roomService.authRole(bodyDto, allowedRole);
  }
}
