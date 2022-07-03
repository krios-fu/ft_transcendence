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
import { JwtService } from '@nestjs/jwt';

interface IRequestProfile extends Request {
    user: UserDto;
};

@Controller('auth')
export class AuthController {
    constructor
    (
      private authService: AuthService,
      private jwtService: JwtService,
    ) { }

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
  @Post('token')
  refreshToken
  (
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    /* obtener user manualmente del token */
    const accessToken = req.cookies['access_token'];
    const jwtPayload = this.jwtService.decode(accessToken);
    
    if (jwtPayload === null) {
      throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    }
    return this.authService.refreshToken(jwtPayload['authToken'], req, res);
  }
}
