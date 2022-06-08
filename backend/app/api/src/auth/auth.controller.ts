import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './guard/fortytwo-auth.guard';
import { Payload } from '../user/user.dto';
import {
    Controller,
    Get,
    UseGuards,
    Req,
} from '@nestjs/common';
import { Public } from '../decorators/public.decorator';

interface IRequestPayload extends Request {
    user: Payload;
};

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
        console.log("AuthController inicializado");
    }

    @Get("42")
    @Public()
    @UseGuards(FortyTwoAuthGuard)
    authFromFT() { /* no */ }

    @Get("42/redirect")
    @Public()
    @UseGuards(FortyTwoAuthGuard)
    async authFromFTRedirect(@Req() req: IRequestPayload): Promise<any> {
        const user = req.user;
        return this.authService.authUser(user);
    }

}
