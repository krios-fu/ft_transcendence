import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '../user/user.dto';
import { AuthToken } from './auth.token';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {
        console.log("AuthService inicializado");
    }

    async authUser(payload: Payload): Promise<AuthToken> {

        if (!payload) {
            console.log("No user in request.");
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        };
        const userProfile = payload.userProfile;
        const accessToken = this.jwtService.sign(
            { data: userProfile.username }, 
            { expiresIn: '100m' }
        );
        const isInDb = await this.userService.findOne(userProfile.username);

        if (!isInDb) {
            await this.userService.postUser(userProfile);
        }
        return { 'accessToken': accessToken };
    }
}
