import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '../users/users.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {
        console.log("AuthService inicializado");
    }

    async login(payload: Payload): Promise<any> {

        if (!payload) {
            console.log("No user in request.");
            return { error: "bad" };
        }
        const accessToken = this.jwtService.sign(payload);
        const userProfile = payload.userProfile;
        const isInDb = this.usersService.findByUsername(userProfile.username);

        if (!isInDb) {
            this.usersService.postUser(userProfile);
        }
        console.log("access token: " + accessToken);
        return { 'accessToken': accessToken };
    }
}
