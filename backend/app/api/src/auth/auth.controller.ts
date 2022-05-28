import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './fortytwo-auth.guard';
import { Payload } from '../users/users.dto';
import {
    Controller,
    Get,
    UseGuards,
    Req,
} from '@nestjs/common';

interface RequestWithPayload extends Request {
    user: Payload;
};

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
        console.log("AuthController inicializado");
    }

    @Get("42")
    @UseGuards(FortyTwoAuthGuard)
    authFromFT(@Req() req: Request) {
        /* no */
    }

    @Get("42/redirect")
    @UseGuards(FortyTwoAuthGuard)
    async authFromFTRedirect(@Req() req: RequestWithPayload): Promise<any> {
        const user = req.user;
        console.log("req debugging " + req);

        this.authService.login(user);
    }

}
