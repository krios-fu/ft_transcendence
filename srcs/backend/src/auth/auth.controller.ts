import { AuthService } from './auth.service';
import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    Post,
    Req,
    Res,
    UnauthorizedException,
    ForbiddenException,
    UseGuards,
    BadRequestException,
} from '@nestjs/common';

import { Public } from '../common/decorators/public.decorator';
import { FortyTwoAuthGuard } from './guard/fortytwo-auth.guard';
import { Request, Response } from 'express';
import { CreateUserDto } from '../user/dto/user.dto';
import { IAuthPayload } from '../common/interfaces/request-payload.interface';
import { UserCreds } from '../common/decorators/user-cred.decorator';
import { UserService } from '../user/services/user.service';
import { TokenCredentials } from './token-credentials.dto';
import { IsNotEmpty, IsNumberString } from 'class-validator';
import { TwoFactorAuthGuard } from './guard/twofactor-auth.guard';
import { UserEntity } from '../user/entities/user.entity';
import { UserCredsDto } from 'src/common/dtos/user.creds.dto';

interface IRequestProfile extends Request {
    user: CreateUserDto;
};

class OtpPayload {
    @IsNumberString(/*{ length: 6 }*/)
    @IsNotEmpty()
    token: string;
}

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) { 
        this.authLogger = new Logger(AuthController.name);
    }

    private readonly authLogger: Logger;

    @Public()
    @Get('42')
    @UseGuards(FortyTwoAuthGuard)
    public async authFromFT
        (
            @Req() req: IRequestProfile,
            @Res({ passthrough: true }) res: Response
        ): Promise<IAuthPayload> {
        if (req.user === null) { /* null or undefined ??? */
            this.authLogger.error('Fortytwo strategy did not provide user profile to auth service');
            throw new HttpException
                (
                    'fortytwo strategy did not provide user profile to auth service',
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
        }
        return this.authService.authUser(req.user, res);
    }

    @Post('/2fa/generate')
    public async generateNew2FASecret(@UserCreds() userCreds: UserCredsDto): Promise<Object> {
        const { username } = userCreds;
        const user = await this.userService.findOneByUsername(username);

        if (user === null) {
            this.authLogger.error(`Request user ${username} not found in database`);
            throw new UnauthorizedException();
        }
        return  { "qr": await this.authService.generateNew2FASecret(user.username, user.id) } ;
    }

    @Post('2fa/deactivate')
    public async deactivate2FA(@UserCreds() userCreds: UserCredsDto) {
        const { username } = userCreds;
        const user: UserEntity = await this.userService.findOneByUsername(username);

        if (user === null) {
            this.authLogger.error(`Request user ${username} not found in database`);
            throw new UnauthorizedException();
        }
        return await this.userService.updateUser(user.id, { 
            doubleAuth: false, 
            doubleAuthSecret: null 
        });
    }

    @Post('/2fa/confirm')
    public async confirm2FAForUser
    (
        @UserCreds() userCreds: UserCredsDto,
        @Body() otpPayload: OtpPayload 
    ) {
        const { username } = userCreds;
        const user: UserEntity = await this.userService.findOneByUsername(username);

        if (user === null) {
            this.authLogger.error(`Request user ${username} not found in database`);
            throw new UnauthorizedException();
        }
        return await this.authService.confirm2FAForUser(user, otpPayload.token);
    }

    @Public()
    @UseGuards(TwoFactorAuthGuard)
    @Post('/2fa/validate')
    public async validate2FACode
        (
            @UserCreds() userCreds: UserCredsDto,
            @Body() otpPayload: OtpPayload,
            @Res({ passthrough: true }) res: Response
        ): Promise<IAuthPayload> {
        const { username } = userCreds;    
        const user = await this.userService.findOneByUsername(username);

        if (user === null) {
            this.authLogger.error(`Request user ${username} not found in database`);
            throw new UnauthorizedException();
        }
        if (!user.doubleAuth || !user.doubleAuthSecret) {
            this.authLogger.error('User has not activated 2FA');
            throw new BadRequestException();
        }
        return await this.authService.validate2FACode(otpPayload.token, user, res);
    }

    @Public()
    @Get('token')
    public async refreshToken
        (
            @Req() req: Request,
            @Res({ passthrough: true }) res: Response
        ) {
        if (!('refresh_token' in req.cookies)) {
            this.authLogger.error('Unauthorized request: no refresh token present in cookies');
            throw new HttpException('user not authenticated', HttpStatus.UNAUTHORIZED);
        }
        const refreshToken: string = req.cookies['refresh_token'];
        const authUser: string = req.query.user as string;
        const authHeader: string | undefined = req.headers.authorization;
        let authPayload: IAuthPayload;

        if (!authUser) {
            throw new HttpException('user not authenticated', HttpStatus.UNAUTHORIZED);
        }
        try {
            authPayload = await this.authService.refreshToken(refreshToken, authUser, authHeader);
        } catch (err) {
            this.authLogger.error(`Caught exception in refreshToken controller: ${err}`);
            await this.authService.logout(authUser, res);
            throw new HttpException(err, HttpStatus.UNAUTHORIZED);
        }
        return authPayload;
    }

    @Post('logout')
    public logout
        (
            @UserCreds() userCreds: UserCredsDto,
            @Res({ passthrough: true }) res: Response
        ) {
        const username: string = userCreds.username;
        this.authService.logout(username, res);
    }
}
