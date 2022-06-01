import { PassportStrategy } from '@nestjs/passport';
import {
    Strategy,
    ExtractJwt,
} from 'passport-jwt';
import { Injectable } from '@nestjs/common';


/* 
   Objecto pasado a super():
     jwtFromRequest: obtiene las credenciales guardadas como payload
       del token en la cabecera 'Authentication'
     ignoreExpiration: ignora Expiration
     secretOrKey: no muy claro, la verdad
 */

/* 
   La clase ExtractJwt se encarga de la comprobación del token,
   y lanza una excepción 401 en caso de no ser válida
 */

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.FORTYTWO_APP_SECRET, /* ??? */
        });
    }


    /* recibimos payload del token validado, devolvemos los valores que nos interesen */
    async validate(payload: any) {
        /* pueden aplicarse aquí lógicas de autorización más estrictas */
        return {
            userId: payload.sub,
            username: payload.username,
        } /* Retorna a PassportModule, que añadirá estos valores a la request */
    }
}
