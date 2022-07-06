import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { RefreshTokenEntity } from './entity/refresh-token.entity';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { UserDto } from 'src/user/user.dto';
import { UserEntity } from 'src/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IJwtPayload } from 'src/interfaces/request-payload.interface';
import { TokenError } from './enum/tokenerror.enum';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        @InjectRepository(RefreshTokenEntity)
        private readonly refreshTokenRepository: RefreshTokenRepository,
    ) { }



    private signJwt(username: string): string {
        return this.jwtService.sign({ 
            data: { username: username },
            expiresIn: 5,
            /* test private key */
        });
    }

    async authUser(userProfile: UserDto, res: Response): Promise<IJwtPayload> {

        if (!userProfile) {
            throw new HttpException
            (
                'fortytwo strategy did not provide user profile to auth service', 
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        };
        const username = userProfile.username;
        let   newUser = await this.userService.findOne(username);

        if (newUser === null) {
            newUser = await this.userService.postUser(userProfile);
        }
        const tokenEntity = new RefreshTokenEntity(
            newUser,
            new Date(Date.now() + (60 * 5)),
        );
        /* esto está mal */
        const refreshToken = await this.refreshTokenRepository.save(tokenEntity);

        console.log(new Date(Date.now() + (3600 * 24 * 7)));

        res.cookie('refresh_token', refreshToken.token, {
            httpOnly: true,
            maxAge: 3600 * 24 * 7,
            sameSite: 'none',
            secure: true,
        })
        return {
            'accessToken': this.signJwt(username),
            'username': username,
        };
    }

    async refreshToken(refreshToken: string, username: string): Promise<IJwtPayload> {
        const tokenEntity = await this.getTokenByUsername(username);

        if (tokenEntity.token != refreshToken) {
            throw TokenError.TOKEN_INVALID;
        }
        if (tokenEntity.expiresIn.getTime() < Date.now()) {
            await this.refreshTokenRepository.delete(tokenEntity);
            throw TokenError.TOKEN_EXPIRED;
        }
        return {
            'accessToken': this.signJwt(username),
            'username': username,
        }
    }

    async logout(username: string, res: Response): Promise<void> {
        const tokenEntity = await this.getTokenByUsername(username);

        await this.refreshTokenRepository.delete(tokenEntity);
        res.clearCookie('refresh_cookie');
    }

    private async getTokenByUsername(username: string): Promise<RefreshTokenEntity> {
        const userEntity = await this.userService.findOne(username);

        if (userEntity === null) {
            throw TokenError.NO_TOKEN_OR_USER;
        }
        const tokenEntity = await this.refreshTokenRepository.findOne({
            where: {
                authUser: userEntity
            }
        });

        if (tokenEntity === null) {
            throw TokenError.NO_TOKEN_OR_USER;
        }
        return tokenEntity;
    }
}
