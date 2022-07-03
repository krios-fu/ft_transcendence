import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { RefreshTokenEntity } from './entity/refresh-token.entity';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { UserDto } from 'src/user/user.dto';
import { UserEntity } from 'src/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

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
            data: {
                username: username,
                expiresIn: new Date(Date.now() + (60 * 5)),
                /* si gestionamos roles por token, aqui toca */
            }
        });
    }

    async authUser(userProfile: UserDto, res: Response): Promise<void> {

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
        const refreshToken = await this.refreshTokenRepository.save(tokenEntity);

        console.log(new Date(Date.now() + (3600 * 24 * 7)));

        res.cookie('session_token', this.signJwt(username), {
            httpOnly: true,
            maxAge: 60 * 5,
            /* secure: true cuando tengamos ssl implementado */
        });
        res.cookie('refresh_token', refreshToken.token, {
            httpOnly: true,
            maxAge: 3600 * 24 * 7,
        })
    }

    async refreshToken(username: string, req: Request, res: Response)/*: Promise<void>*/ {
        /* la sesión de usuario no tiene token */
        const refreshToken = req.cookies['refresh_cookie'];
        if (refreshToken === null) {
            throw new HttpException('User not authorized', HttpStatus.UNAUTHORIZED);
        }
        /* el usuario no está autentificado en la base de dates */
        const userEntity: UserEntity = await this.userService.findOne(username);

        if (userEntity === null) {
            throw new HttpException('User not authorized', HttpStatus.UNAUTHORIZED);
        }
        const tokenInfo: RefreshTokenEntity = await this.refreshTokenRepository.findOne({
            where: {
                authUser: userEntity,
            }
        });
        /* el usuario no tiene asignado un token */
        if (tokenInfo === null) {
            throw new HttpException('User not authorized', HttpStatus.UNAUTHORIZED);
        }
        /* el usuario usa un token expirado o inválido */
        if (
            tokenInfo.expiresIn.getTime() < Date.now() ||
            tokenInfo.token != refreshToken
        ) {
            res.clearCookie('refresh_cookie');
            throw new HttpException('User not authorized', HttpStatus.UNAUTHORIZED);
        }
        /*res.cookie('session_token', this.signJwt(username), {
            httpOnly: true,
            maxAge: 60 * 5,
        })*/
        return {
            'accessToken'
        }
    }
}
