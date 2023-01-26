import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { RefreshTokenEntity } from './entity/refresh-token.entity';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { CreateUserDto } from '../user/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthPayload } from '../common/interfaces/request-payload.interface';
import { TokenError } from './enum/token-error.enum';
import { UserEntity } from '../user/entities/user.entity';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        @InjectRepository(RefreshTokenEntity)
        private readonly refreshTokenRepository: RefreshTokenRepository
    ) { }

    private signJwt(username: string): string {
        return this.jwtService.sign({ 
            data: { 
                username: username,
                validated: true
            },
        });
    }

    private signLowPrivJwt(username: string): string {
        return this.jwtService.sign({
            data: { 
                username: username,
                validated: false
            }
        })
    }

    public async authUser(userProfile: CreateUserDto, res: Response): Promise<IAuthPayload> {
        const username: string = userProfile.username;
        let   loggedUser: UserEntity;
        
        loggedUser = await this.userService.findOneByUsername(username);
        if (loggedUser === null) {
            loggedUser = await this.userService.postUser(userProfile);
        }
        if (loggedUser.doubleAuth === true) {
            return {
                'accessToken': this.signLowPrivJwt(username),
                'username': username
            }
        }
        return await this.authUserValidated(loggedUser, res);
    }

    private async authUserValidated(user: UserEntity, res: Response): Promise<IAuthPayload> {
        let   tokenEntity: RefreshTokenEntity;

        tokenEntity = await this.refreshTokenRepository.findOne({
            relations: { authUser: true },
            where: {
                authUser: { username: user.username }
            }
        })
        if (tokenEntity === null) {
            const newToken = new RefreshTokenEntity({
                authUser: user,
                expiresIn: new Date(Date.now() + (1000 * 3600 * 24 * 7))
            });

            tokenEntity = await this.refreshTokenRepository.save(newToken);
        }
        res.cookie('refresh_token', tokenEntity.token, {
            httpOnly: true,
            maxAge: 1000 * 3600 * 24 * 7,
            sameSite: 'none',
            secure: true,
        });
        return {
            'accessToken': this.signJwt(user.username),
            'username': user.username,
        };
    }

    public async getTokenByUsername(username: string): Promise<RefreshTokenEntity> {
        let tokenEntity: RefreshTokenEntity;
        let userEntity: UserEntity;

        userEntity = await this.userService.findOneByUsername(username);
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

    public async refreshToken(refreshToken: string, username: string): Promise<IAuthPayload> {
        let tokenEntity: RefreshTokenEntity;
  
        tokenEntity = await this.getTokenByUsername(username);
        if (tokenEntity.token != refreshToken) {
            throw TokenError.TOKEN_INVALID;
        } else if (tokenEntity.expiresIn.getTime() < Date.now()) {
            await this.refreshTokenRepository.delete(tokenEntity.token);
            throw TokenError.TOKEN_EXPIRED;
        }
        return {
            'accessToken': this.signJwt(username),
            'username': username,
        }
    }

    public async logout(username: string, res: Response): Promise<void> {
        let tokenEntity: RefreshTokenEntity;

        try {
            tokenEntity = await this.getTokenByUsername(username);
        } catch(err) {
            console.error(`Caught exception in logout: ${err} \
                (user logged out without a valid session)`);
        }
        await this.refreshTokenRepository.delete(tokenEntity.token);
        res.clearCookie('refresh_token');
    }

    public async generateNew2FASecret(username: string, id: number): Promise<Object> {
        const userSecret = authenticator.generateSecret();
        this.userService.updateUser(id, { 
            /*doubleAuth: true,*/
            doubleAuthSecret: userSecret 
        });
        const keyuri = authenticator.keyuri(username, 'ft_transcendence', userSecret);
        /* 
        **  For testing purposes:
        **      print generated QR code in terminal
        **/
         const qr_img = await QRCode.toString(keyuri, { type: 'terminal' })
         console.log(`QR generated: \n${qr_img}`);
        /**/
        return { qr: await QRCode.toDataURL(keyuri) };
    }

    public async confirm2FAForUser(user: UserEntity, token: string) {
        const { id, doubleAuthSecret: secret } = user;

        if (authenticator.verify({token, secret}) === false) {
            throw new BadRequestException('invalid token');
        }
        await this.userService.updateUser(id, { doubleAuth: true });
    }

    public async validate2FACode(token: string, user: UserEntity, res: Response): Promise<IAuthPayload> {
        const { doubleAuthSecret: secret } = user;
        
        if (authenticator.verify({ token, secret }) === false) {
            throw new BadRequestException();
        }
        return await this.authUserValidated(user, res);
    }
}
