import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { RefreshTokenEntity } from './entity/refresh-token.entity';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { CreateUserDto } from '../user/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthPayload } from 'src/common/interfaces/request-payload.interface';
import { IJwtPayload } from 'src/common/interfaces/request-payload.interface';
import { TokenError } from './enum/token-error.enum';
import { UserEntity } from '../user/entities/user.entity';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import { EncryptionService } from './service/encryption.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        @InjectRepository(RefreshTokenEntity)
        private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly encryptionService: EncryptionService
    ) { }

    private signJwt(user: UserEntity): string {
        const   { id, username } = user;
        const   token: string = this.jwtService.sign({
            data: {
                id: id,
                username: username,
                validated: true
            },
            iss: 'http://localhost:3000',
            aud: process.env.WEBAPP_IP
        });
    
        return (this.encryptionService.encrypt(token));
    }

    private signLowPrivJwt(user: UserEntity): string {
        const   { id, username } = user;
        const   token: string = this.jwtService.sign({
            data: { 
                id: id,
                username: username,
                validated: false
            },
            iss: 'http://localhost:3000',
            aud: process.env.WEBAPP_IP
        });

        return (this.encryptionService.encrypt(token));
    }

    public async authUser(userProfile: CreateUserDto, res: Response): Promise<IAuthPayload> {
        const { username } = userProfile;
        let loggedUser: UserEntity = await this.userService.findOneByUsername(username);
        let authPayload: IAuthPayload;
        let firstTimeFlag: boolean = false;
        
        if (loggedUser === null) {
            loggedUser = await this.userService.postUser(userProfile);
            firstTimeFlag = true;
        }
        if (loggedUser.doubleAuth === true) {
            authPayload = {
                'accessToken': this.signLowPrivJwt(loggedUser),
                'username': username,
                'id': loggedUser.id
            }
        } else {
            authPayload = await this.authUserValidated(loggedUser, res);
        }
        if (firstTimeFlag) {
            authPayload.firstTime = firstTimeFlag;
        }
        return authPayload;
    }

    private async authUserValidated(user: UserEntity, res: Response): Promise<IAuthPayload> {
        const { id, username } = user;
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
            'accessToken': this.signJwt(user),
            'username': username,
            'id': id
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

    private _identifyTokenStrength(authHeader: string | undefined, doubleAuth: boolean): boolean {
        let tokenPayload: IJwtPayload;
        let token: string;

        if (!authHeader) {
            return doubleAuth;
        }
        token = authHeader.split(' ')[1];
        tokenPayload = this.extractPayloadFromJWT(token);
        if (!tokenPayload) {
            return doubleAuth;
        }
        return !(tokenPayload.data.validated);
    }

    public async refreshToken(
        refreshToken: string, 
        username: string,
        authHeader: string | undefined
    ): Promise<IAuthPayload> {
        let tokenEntity: RefreshTokenEntity = await this.getTokenByUsername(username);
  
        if (tokenEntity.token != refreshToken) {
            throw TokenError.TOKEN_INVALID;
        } else if (tokenEntity.expiresIn.getTime() < Date.now()) {
            throw TokenError.TOKEN_EXPIRED;
        }
        const { authUser } = tokenEntity;
        const accessToken: string = 
            this._identifyTokenStrength(authHeader, authUser.doubleAuth) ?
                this.signLowPrivJwt(authUser) :
                this.signJwt(authUser);
        return {
            'accessToken': accessToken,
            'username': username,
            'id': authUser.id
        }
    }

    public async logout(username: string, res: Response): Promise<void> {
        let tokenEntity: RefreshTokenEntity;

        try {
            tokenEntity = await this.getTokenByUsername(username);
            await this.refreshTokenRepository.delete(tokenEntity.token);
        } catch(err) { }
        res.clearCookie('refresh_token');
    }

    public async generateNew2FASecret(username: string, id: number): Promise<Object> {
        const userSecret = authenticator.generateSecret();
        this.userService.updateUser(id, {
            doubleAuthSecret: userSecret 
        });
        const keyuri: string = authenticator.keyuri(username, 'ft_transcendence', userSecret);
        return { qr: await QRCode.toDataURL(keyuri) };
    }

    public async confirm2FAForUser(user: UserEntity, token: string) {
        const { id, doubleAuthSecret: secret } = user;

        if (authenticator.verify({token, secret}) === false) {
            throw new BadRequestException('invalid token');
        }
        return await this.userService.updateUser(id, { doubleAuth: true });
    }

    public async validate2FACode(token: string, user: UserEntity, res: Response): Promise<IAuthPayload> {
        const { doubleAuthSecret: secret } = user;
        
        if (!authenticator.verify({ token, secret })) {
            throw new BadRequestException();
        }
        return await this.authUserValidated(user, res);
    }

    public validateJWToken(token: string): IJwtPayload | undefined {
        let result: IJwtPayload | undefined;
    
        try {
            result = this.jwtService.verify<IJwtPayload>(token, {
                secret: process.env.FORTYTWO_APP_SECRET
            });
        }
        catch(err) {
            console.error(`validateJWTToken: ${err}`);
            result = undefined;
        }
        return (result);
    }

    public extractPayloadFromJWT(token: string): IJwtPayload | undefined {
        let payload: IJwtPayload | undefined;

        try {
            payload  = this.jwtService.verify<IJwtPayload>(
                token,
                {
                    secret: process.env.FORTYTWO_APP_SECRET,
                    ignoreExpiration: true
                }
            )
        } catch (_) {
            return undefined;
        }
        return payload;
    }

    public validate2FASession(req: Request): boolean {
        const token: string | undefined = req.headers['authorization']
            .split(' ')[1];
        if (token === undefined) {
            return false;
        }
        const payload: IJwtPayload | undefined = this.validateJWToken(token);
        return payload !== undefined && payload.data.validated;
    }
}
