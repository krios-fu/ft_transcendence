import { AuthGuard } from '@nestjs/passport';
import {
    Injectable,
    ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';
import { Request } from 'express';
import { EncryptionService } from '../service/encryption.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private reflector: Reflector,
        private readonly encryptionService: EncryptionService
    ) {
        super();
    }

    private _extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
    
        return type === 'Bearer' ? token : undefined;
    }

    canActivate(context: ExecutionContext) {
        const   request: Request = context.switchToHttp().getRequest<Request>();
        const   token: string = this._extractTokenFromHeader(request);
        const   isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ]);
        
        if (token)
        {
            request.headers.authorization =
                        `Bearer ${this.encryptionService.decrypt(token)}`;
        }
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }
}
