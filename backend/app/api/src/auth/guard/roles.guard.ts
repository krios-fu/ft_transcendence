import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { Roles } from 'src/room/roles.enum';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userRepository: UserRepository,
  ) { }

  canActivate(
    ctxt: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
        const routeRole = this.reflector.getAllAndOverride<Roles[]> (
            ROLES_KEY,
            [
                ctxt.getHandler(),
                ctxt.getClass(),           
            ]
        )

        if (routeRole <= )
  }
}
