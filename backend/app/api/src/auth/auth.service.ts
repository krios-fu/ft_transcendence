import { ConsoleLogger, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { RefreshTokenEntity } from './entity/refresh-token.entity';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { UserDto } from 'src/user/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthPayload } from 'src/interfaces/request-payload.interface';
import { TokenError } from './enum/token-error.enum';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        @InjectRepository(RefreshTokenEntity)
        private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly logger: Logger,
    ) { }

    private signJwt(username: string): string {
        return this.jwtService.sign({ 
            data: { username: username },
        });
    }

    async authUser(userProfile: UserDto, res: Response): Promise<IAuthPayload> {
        const username: string = userProfile.username;
        let   loggedUser: UserEntity;
        let   tokenEntity: RefreshTokenEntity;
        
        loggedUser = await this.userService.findOne(username);
        if (loggedUser === null) {
            loggedUser = await this.userService.postUser(userProfile);
        }
        tokenEntity = await this.refreshTokenRepository.findOne({
            relations: { authUser: true},
            where: {
                authUser: { username: loggedUser.username }
            }
        })
        if (tokenEntity === null) {
            const newToken = new RefreshTokenEntity({
                authUser: loggedUser,
                expiresIn: new Date(Date.now() + (3600 * 24 * 7))
            });

            tokenEntity = await this.refreshTokenRepository.save(newToken);
        }
        res.cookie('refresh_token', tokenEntity.token, {
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

    async refreshToken(refreshToken: string, username: string): Promise<IAuthPayload> {
        let tokenEntity: RefreshTokenEntity;

        try {  
            tokenEntity = await this.getTokenByUsername(username);
        } catch (err) {
            this.logger.error(`Caught exception in refreshToken: ${err}`);
            throw err;
        }
        if (tokenEntity.token != refreshToken) {
            throw TokenError.TOKEN_INVALID;
        } else if (tokenEntity.expiresIn.getTime() < Date.now()) {
            await this.refreshTokenRepository.delete(tokenEntity);
            throw TokenError.TOKEN_EXPIRED;
        }
        return {
            'accessToken': this.signJwt(username),
            'username': username,
        }
    }

    async logout(username: string, res: Response): Promise<void> {
        let tokenEntity: RefreshTokenEntity;

        console.log('1');
        try {
            tokenEntity = await this.getTokenByUsername(username);
        } catch(err) {
            console.log('1e');
            this.logger.error(`Caught exception in logout: ${err} \
                (user logged out without a valid session)`);
            /*throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);*/
        }
        console.log('2');
        await this.refreshTokenRepository.delete(tokenEntity);
        console.log('3');
        res.clearCookie('refresh_token');
    }

    async getTokenByUsername(username: string): Promise<RefreshTokenEntity> {
        let tokenEntity: RefreshTokenEntity;
        let userEntity: UserEntity;


        userEntity = await this.userService.findOne(username);
        if (userEntity === null) {
            throw TokenError.NO_TOKEN_OR_USER;
        }
        tokenEntity = await this.refreshTokenRepository.findOne({
            relations: { authUser: true },
            where: {
                authUser: { username: userEntity.username }
            }
        });
        if (tokenEntity === null) {
            throw TokenError.NO_TOKEN_OR_USER;
        }
        return tokenEntity;
    }
}
