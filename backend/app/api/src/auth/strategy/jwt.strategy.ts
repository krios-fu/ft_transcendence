import { PassportStrategy } from '@nestjs/passport';
import {
    Strategy,
    ExtractJwt,
} from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { IJwtPayload } from 'src/interfaces/ijwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request): string => {
                    let token: string = null;

                    if (req && req.cookies) {
                        token = req.cookies['session_token'];
                    }
                    return token;
                }
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.FORTYTWO_APP_SECRET,
            algorithm: 'HS256',
            issuer: 'http://localhost:4200',   /* dev */
            audience: 'http://localhost:3000', /* dev */
        });
    }

    async validate(jwtPayload: IJwtPayload): Promise<IJwtPayload> {
        if (jwtPayload.expiresIn.getTime() < Date.now()) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
        return jwtPayload;
    }
}