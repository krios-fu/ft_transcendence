import { PassportStrategy } from '@nestjs/passport';
import {
    Strategy,
    ExtractJwt,
} from 'passport-jwt';
import { ForbiddenException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { IJwtPayload } from '../../common/interfaces/request-payload.interface';
import { UserService } from '../../user/services/user.service';
import { UserRolesService } from '../../user_roles/user_roles.service';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class TwoFactorStrategy extends PassportStrategy(Strategy, 'two-factor') {
constructor (
    private readonly userService: UserService,
    private readonly userRolesService: UserRolesService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.FORTYTWO_APP_SECRET,
            algorithm: 'HS256',
            issuer: 'http://localhost:3000',
            audience: process.env.WEBAPP_IP
        });
        this.twoFactorLogger = new Logger(TwoFactorStrategy.name);
    }
    private twoFactorLogger: Logger;

    async validate(jwtPayload: IJwtPayload): Promise<IJwtPayload> {
        const username: string | undefined = jwtPayload.data?.username;
        const id: number | undefined = jwtPayload.data?.id;

        if (username === undefined) {
            this.twoFactorLogger.error('JWT auth. service unexpected failure');
            throw new InternalServerErrorException()
        }
        const user: UserEntity = await this.userService.findOneByUsername(username);
        if (user.id !== id) {
            this.twoFactorLogger.error('Unauthorized login');
            throw new UnauthorizedException;
        }
        if (user === undefined) {
            this.twoFactorLogger.error(`User ${username} validated by jwt not found in database`);
            throw new ForbiddenException();
        }
        if (await this.userRolesService.validateGlobalRole(user.username, ['banned']) === true) {
            this.twoFactorLogger.error(`User ${username} is banned from the server`);
            throw new UnauthorizedException();
        }
        if (jwtPayload.data.validated === true || user.doubleAuth === false || user.doubleAuthSecret === null) {
            throw new ForbiddenException('user is already validated with 2fa strategy or does not need it');
        }
        return jwtPayload;
    }
}