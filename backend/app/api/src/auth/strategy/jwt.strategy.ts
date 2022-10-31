 import { PassportStrategy } from '@nestjs/passport';
import {
    Strategy,
    ExtractJwt,
} from 'passport-jwt';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { IJwtPayload } from 'src/common/interfaces/request-payload.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
constructor
(
    private authService: AuthService,
    private readonly logger: Logger,
) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.FORTYTWO_APP_SECRET,
            algorithm: 'HS256',
        //    issuer: 'http://localhost:4200',   /* dev */
        //    audience: 'http://localhost:3000', /* dev */
        });
    }

    /* force logout logic:
            Si se valida el JWT de una petición,
            pero no existe un refresh-token asociado al usuario que
            lo identifica, significa que se ha hecho un logout en otra 
            pestaña o dispositivo de este usuario (/logout elimina refresh-token)

            Invalidamos petición manualmente
    */
    async validate(jwtPayload: IJwtPayload): Promise<IJwtPayload> {
        try {
            await this.authService.getTokenByUsername(jwtPayload.data.username);
        } catch(err) {
            this.logger.error(`failed to acquire refresh token for user ${jwtPayload.data.username}`);
            throw new HttpException
            (
                'User has been logged out in another device',
                HttpStatus.UNAUTHORIZED
            );
        }
        return jwtPayload;
    }
}