import { ConsoleLogger, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { RefreshTokenEntity } from './entity/refresh-token.entity';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { UserDto } from 'src/user/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IJwtPayload } from 'src/interfaces/request-payload.interface';
import { TokenError } from './enum/token-error.enum';
import { UserEntity } from 'src/user/user.entity';

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
            expiresIn: 2 * 60,
            /* test private key */
        });
    }

    async authUser(userProfile: UserDto, res: Response): Promise<IJwtPayload> {
        const username: string = userProfile.username;
        let   loggedUser: UserEntity;
        let   token: string;
        
        this.userService.findOne(username).then((newUser: UserEntity | null) => {
            if (newUser === null) {
                this.userService.postUser(userProfile).then((savedUser: UserEntity) => {
                    loggedUser = savedUser;
                });
            } else {
                loggedUser = newUser;
            }
        });
        await this.refreshTokenRepository.findOne({
            where: {
                authUser: loggedUser,
            }
        }).then(async (tokenEntity: RefreshTokenEntity | null) => {
            if (tokenEntity === null) {
                await this.refreshTokenRepository.save({
                    authUser: loggedUser,
                    expiresIn: new Date(Date.now() + (3600 * 24 * 7)),
                }).then((newTokenEntity: RefreshTokenEntity) => {
                    token = newTokenEntity.token;
                })
            } else {
                token = tokenEntity.token;
            }
            console.log('hemos guardado un refresh-token de la forma: ' + JSON.stringify(tokenEntity));
        });
        res.cookie('refresh_token', token, {
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
        await this.getTokenByUsername(username)
            .then(async (tokenEntity: RefreshTokenEntity) => {
                if (tokenEntity.token != refreshToken) {
                    throw TokenError.TOKEN_INVALID;
                } else if (tokenEntity.expiresIn.getTime() < Date.now()) {
                    await this.refreshTokenRepository.delete(tokenEntity);
                    throw TokenError.TOKEN_EXPIRED;
                }
            });
        return {
            'accessToken': this.signJwt(username),
            'username': username,
        }
    }

    async logout(username: string, res: Response): Promise<void> {
        await this.getTokenByUsername(username)
            .then(async (tokenEntity: RefreshTokenEntity) => {
                await this.refreshTokenRepository.delete(tokenEntity);
            })
            .catch(() => {
                console.error('user logged out without valid session');
            });
        res.clearCookie('refresh_cookie');
    }

    async getTokenByUsername(username: string): Promise<RefreshTokenEntity> {
        let token: RefreshTokenEntity;

        await this.userService.findOne(username)
            .then(async (user: UserEntity) => {
                if (user === null) {
                    throw TokenError.NO_TOKEN_OR_USER;
                }
                console.log('estamos comprobando user de la forma: ' + JSON.stringify(user));
                await this.refreshTokenRepository.findOne({
                    where: { authUser: user }
                }).then((savedToken: RefreshTokenEntity) => {
                    if (savedToken === null) {
                        throw TokenError.NO_TOKEN_OR_USER;
                    }
                    token = savedToken;
            })
        });
        return token;
    }
}
