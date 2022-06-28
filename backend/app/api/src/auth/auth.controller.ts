import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './guard/fortytwo-auth.guard';
import { Payload } from '../user/user.dto';
import {
    Controller,
    Get,
    UseGuards,
  Req,
  Redirect,
} from '@nestjs/common';
import { Public } from '../decorators/public.decorator';

interface IRequestPayload extends Request {
    user: Payload;
};

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Get("42")
    @Public()
    @UseGuards(FortyTwoAuthGuard)
    authFromFT() { /* no */ }

  @Get("42/redirect")
  @Redirect("http://localhost:4200/home")
    @Public()
    @UseGuards(FortyTwoAuthGuard)
    async authFromFTRedirect(@Req() req: IRequestPayload): Promise<any> {
        const user = req.user;
        return this.authService.authUser(user);
    }

}
