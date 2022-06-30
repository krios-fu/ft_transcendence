import { AuthService } from './auth.service';
import { Payload } from '../user/user.dto';
import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
import { FortyTwoAuthGuard } from './guard/fortytwo-auth.guard';

interface IRequestPayload extends Request {
    user: Payload;
};

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

  @Get('42')
  @UseGuards(FortyTwoAuthGuard)
  @Public()
  async authFromFT(@Req() req: IRequestPayload) { 
    const user = req.user;

    return this.authService.authUser(user);
  }
}
