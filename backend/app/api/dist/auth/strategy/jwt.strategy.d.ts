import { Strategy } from 'passport-jwt';
import { Logger } from '@nestjs/common';
import { IJwtPayload } from 'src/interfaces/request-payload.interface';
import { AuthService } from '../auth.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private authService;
    private readonly logger;
    constructor(authService: AuthService, logger: Logger);
    validate(jwtPayload: IJwtPayload): Promise<IJwtPayload>;
}
export {};
