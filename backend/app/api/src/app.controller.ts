import {
    Controller,
    Get,
    Request,
    Post,
    UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
//import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Public } from './auth/public.decorator';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly authService: AuthService,
    ) {
        console.log("AppController inicializado");
    }

    @UseGuards(LocalAuthGuard) /* Comprobación de credenciales */
    @Post('auth/login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    //    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @Get()
    @Public()
    getHello(): string {
        return this.appService.getHello();
    }
}
