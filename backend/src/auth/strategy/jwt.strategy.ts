 import { PassportStrategy } from '@nestjs/passport';
import {
    Strategy,
    ExtractJwt,
} from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { IJwtPayload } from 'src/common/interfaces/request-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
constructor () {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.FORTYTWO_APP_SECRET,
            algorithm: 'HS256',
        //    issuer: 'http://localhost:4200',   /* dev */
        //    audience: 'http://localhost:3000', /* dev */
        });
    }

    async validate(jwtPayload: IJwtPayload): Promise<IJwtPayload> {
        return jwtPayload;
    }
}