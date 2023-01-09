import { PassportStrategy } from '@nestjs/passport';
import {
    Strategy,
    ExtractJwt,
} from 'passport-jwt';
import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { IJwtPayload } from 'src/common/interfaces/request-payload.interface';
import { UserService } from 'src/user/services/user.service';
import { UserRolesService } from 'src/user_roles/user_roles.service';

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
        //    issuer: 'http://localhost:4200',   /* dev */
        //    audience: 'http://localhost:3000', /* dev */
        });
        this.jwtLogger = new Logger(JwtStrategy.name);
    }
    private jwtLogger: Logger;

    async validate(jwtPayload: IJwtPayload): Promise<IJwtPayload> {
        const username = jwtPayload.data?.username;
        if (username === undefined) {
            this.jwtLogger.error('JWT auth. service unexpected failure');
            throw new InternalServerErrorException()
        }
        const user = await this.userService.findOneByUsername(username);

        if (user === undefined) {
            this.jwtLogger.error(`User ${username} validated by jwt not found in database`);
            throw new UnauthorizedException();
        }
        if (await this.userRolesService.validateGlobalRole(user.username, 'banned') === true) {
            this.jwtLogger.error(`User ${username} is banned from the server`);
            throw new UnauthorizedException();
        }
        if (jwtPayload.data?.validated !== true) {
            throw new UnauthorizedException('User needs validation for 2fa strategy');
        }
        return jwtPayload;
    }
}