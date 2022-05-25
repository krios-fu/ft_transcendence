/* Estrategia de autentificación local *
 *
 * PassportStrategy espera una implementación de validate()
 * que comprueba si el usuario existe y posee permisos válidos.
 */

import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt'; 

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService,
	private jwtService: JwtService,
    ) {
        super();
    }

    async validate(username: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(username, password);

        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }

    async login(user: any) {
	const payload = { username: user.username, sub: user.userId };

	console.log(this.jwtService.sign(payload));
	return {
	    access_token: this.jwtService.sign(payload), /* .sign() crea el token usado como jwt */
	};
    }
}
