import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '../user/user.dto';
import { AuthToken } from './auth.token';
import { RoomService } from 'src/room/room.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly roomService: RoomService
    ) {
        console.log("AuthService inicializado");
    }

    async authUser(payload: Payload): Promise<AuthToken> {

        if (!payload) {
            console.log("No user in request.");
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        };
        const userProfile = payload.userProfile;
        const accessToken = this.jwtService.sign(userProfile.username);
        const isInDb = await this.userService.findOne(userProfile.username);

        if (isInDb === undefined) {
            await this.userService.postUser(userProfile);
        }
        return { 'accessToken': accessToken };
    }
}
