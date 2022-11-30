 import { PassportStrategy } from '@nestjs/passport';
import {
    Strategy,
    ExtractJwt,
} from 'passport-jwt';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { IJwtPayload } from 'src/common/interfaces/request-payload.interface';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
constructor (
    private readonly userService: UserService,
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
        const user = await this.userService.findOneByUsername(jwtPayload.data.username);

        if (user === undefined) {
            this.jwtLogger.error(`User ${jwtPayload.data.username} validated by jwt not found in database`);
            throw new UnauthorizedException();
        }
        return jwtPayload;
    }
}