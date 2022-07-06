import { AuthService } from './auth.service';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
import { FortyTwoAuthGuard } from './guard/fortytwo-auth.guard';
import { Request, Response } from 'express';
import { UserDto } from 'src/user/user.dto';
import { IJwtPayload, IRequestUser } from 'src/interfaces/request-payload.interface';

interface IRequestProfile extends Request {
    user: UserDto;
};

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

  @Public()
  @Get('42')
  @UseGuards(FortyTwoAuthGuard)
  async authFromFT
  (
    @Req() req: IRequestProfile,
    @Res({ passthrough: true }) res: Response
  ) { 
    const user = req.user;

    return this.authService.authUser(user, res);
  }

  @Public()
  @Get('token')
  refreshToken
  (
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const refreshToken: string = req.cookies['refresh_cookie'];
    const authUser: string = req.query.user as string;

    if (authUser === null || refreshToken === null) {
      throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    }
    this.authService.refreshToken(refreshToken, authUser)
      .then((authPayload: IJwtPayload) => { 
        return authPayload;
      }).catch((error) => {
        res.clearCookie('refresh_cookie');
        throw new HttpException(error, HttpStatus.UNAUTHORIZED);
      });
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
