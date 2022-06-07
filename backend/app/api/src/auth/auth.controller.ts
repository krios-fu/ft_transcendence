import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './guard/fortytwo-auth.guard';
import { Payload } from '../users/users.dto';
import {
    Controller,
    Get,
    UseGuards,
    Req,
} from '@nestjs/common';
import { Public } from '../decorators/public.decorator';

interface RequestWithPayload extends Request {
    user: Payload;
};

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
        console.log("AuthController inicializado");
    }

    @Public()
    @Get("42")
    @UseGuards(FortyTwoAuthGuard)
    authFromFT() { /* no */ }

    @Get("42/redirect")
    @Public()
    @UseGuards(FortyTwoAuthGuard)
    async authFromFTRedirect(@Req() req: RequestWithPayload): Promise<any> {
        const user = req.user;
        console.log("req debugging " + req);

        return this.authService.login(user);
    }

}
