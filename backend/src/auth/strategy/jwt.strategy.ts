import { PassportStrategy } from '@nestjs/passport';
import {
    Strategy,
    ExtractJwt,
} from 'passport-jwt';
import { ForbiddenException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { IJwtPayload } from '../../common/interfaces/request-payload.interface';
import { UserService } from '../../user/services/user.service';
import { NotValidatedException } from '../../common/classes/not-validated.exception';
import { UserRolesService } from '../../user_roles/user_roles.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { BannedException } from 'src/common/classes/banned.exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
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
        this.jwtLogger = new Logger(JwtStrategy.name);
    }
    private jwtLogger: Logger;

    async validate(jwtPayload: IJwtPayload): Promise<IJwtPayload> {
        const username: string | undefined = jwtPayload.data?.username;
        const id: number | undefined = jwtPayload.data?.id;

        if (username === undefined || id === undefined) {
            this.jwtLogger.error('JWT auth. service unexpected failure');
            throw new InternalServerErrorException()
        }
        const user: UserEntity= await this.userService.findOneByUsername(username);
        if (user === null) {
            this.jwtLogger.error(`Authentication token not assigned to a registered user`);
            throw new UnauthorizedException();
        }
        if (user.id !== id) {
            this.jwtLogger.error('Unauthorized login');
            throw new UnauthorizedException();
        }
        if (await this.userRolesService.validateGlobalRole(user.username, ['banned']) === true) {
            this.jwtLogger.error(`User ${username} is banned from the server`);
            throw new BannedException();
        }
        if (jwtPayload.data?.validated !== true) {
            throw new NotValidatedException('User needs validation for 2fa strategy');
        }
        return jwtPayload;
    }
}
