import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '../user/user.dto';
import { RoomDto } from 'src/room/room.dto';
import { AuthToken } from './auth.token';
import { RoomService } from 'src/room/room.service';
import * as bcrypt from 'bcrypt';

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
        const isInDb = this.userService.findOne(userProfile.username);

        if (!Object.keys(isInDb).length) {
            this.userService.postUser(userProfile);
        }
        return { 'accessToken': accessToken };
    }

    async loginToRoom(roomCredentials: RoomDto): Promise<boolean> {
        const roomEntity = await this.roomService.findOne(roomCredentials.name);

        if (!Object.keys(roomEntity).length) {
            throw new HttpException('Room does not exist in db', HttpStatus.BAD_REQUEST);
        }
        if (roomEntity.password === undefined) {
            return true;
        }
        return await bcrypt.compare(roomEntity.password, roomEntity.password);
    }
}
