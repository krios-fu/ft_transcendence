import { AuthGuard } from '@nestjs/passport';
import {
    Injectable,
    ExecutionContext,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TwoFactorAuthGuard extends AuthGuard('two-factor') {
    constructor() { super(); }

    canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(ctx);
    }
}