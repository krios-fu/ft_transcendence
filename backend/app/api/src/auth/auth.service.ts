import { Injectable } from '@nestjs/common';
import { UserServices } from '../user/user.service';

/* Servicios en AUTH module:
 *   Reciben credenciales de usuario, buscan usuario en 
 *   el repositorio que sirve de interface a la base de
 *   datos con los usuarios registrados almacenados, comprueba
 *   si el usuario está registrado y si sus credenciales son válidas
 * 
 *   ( lógica de estrategia más básica )
 */

@Injectable()
export class AuthService {
    constructor(
        private userServices: UserServices,
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.userServices.getUserById(username);

        if (user && user.password == pass) {
            const { password, ...result } = user; // ?!?!?!?!?

            return result;
        }
        return null;
    }
}
