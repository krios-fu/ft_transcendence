import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '../user/user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
    ) {
        console.log("AuthService inicializado");
    }

    async login(payload: Payload): Promise<any> {

        if (!payload) {
            console.log("No user in request.");
            return new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        };
        const accessToken = this.jwtService.sign(payload);
        const userProfile = payload.userProfile;
        const isInDb = this.usersService.findOne(userProfile.username);

        if (!Object.keys(isInDb).length) {
            this.usersService.postUser(userProfile);
        }
        return { 'accessToken': accessToken };
    }
}
