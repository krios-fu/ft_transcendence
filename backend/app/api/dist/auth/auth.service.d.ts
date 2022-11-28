import { Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { RefreshTokenEntity } from './entity/refresh-token.entity';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { UserDto } from 'src/user/user.dto';
import { IAuthPayload } from 'src/interfaces/request-payload.interface';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private readonly refreshTokenRepository;
    private readonly logger;
    constructor(userService: UserService, jwtService: JwtService, refreshTokenRepository: RefreshTokenRepository, logger: Logger);
    private signJwt;
    authUser(userProfile: UserDto, res: Response): Promise<IAuthPayload>;
    refreshToken(refreshToken: string, username: string): Promise<IAuthPayload>;
    logout(username: string, res: Response): Promise<void>;
    getTokenByUsername(username: string): Promise<RefreshTokenEntity>;
}
