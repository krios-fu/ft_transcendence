import { AuthGuard } from '@nestjs/passport';
import {
    Injectable,
    ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

/* Reflector: acceso a metadatos (roles)  de la ruta */
/* Se ha de reescribir la función canActivate, heredada de
 * la interfaz AuthGuard */

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }
}
