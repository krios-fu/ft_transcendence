import { AuthService } from './auth.service';
import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { FortyTwoAuthGuard } from './guard/fortytwo-auth.guard';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { IAuthPayload, IRequestUser } from 'src/common/interfaces/request-payload.interface';

interface IRequestProfile extends Request {
    user: CreateUserDto;
};

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly logger: Logger
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
        ) {
        if (req.user === null) {
            throw new HttpException
                (
                    'fortytwo strategy did not provide user profile to auth service',
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
        }
        return this.authService.authUser(req.user, res);
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
        let authPayload: IAuthPayload;

        if (authUser === null) {
            throw new HttpException('user not authenticated', HttpStatus.UNAUTHORIZED);
        }
        try {
            authPayload = await this.authService.refreshToken(refreshToken, authUser);
        } catch (err) {
            this.logger.error(`Caught exception in refreshToken controller: ${err}`);
            res.clearCookie('refresh_cookie');
            throw new HttpException(err, HttpStatus.UNAUTHORIZED);
        }
        return authPayload;
    }

    @Post('logout')
    logout
        (
            @Req() req: IRequestUser,
            @Res({ passthrough: true }) res: Response
        ) {
        this.authService.logout(req.username, res);
    }
}
