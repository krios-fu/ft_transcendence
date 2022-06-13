import { PassportStrategy } from '@nestjs/passport';
import {
    Strategy,
    ExtractJwt,
} from 'passport-jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.FORTYTWO_APP_SECRET,
        });
    }

    async validate(payload: any) {
        return {
            /*userId: payload.sub,
            username: payload.username,*/
            username: payload.userProfile.username
        }
    }
}
