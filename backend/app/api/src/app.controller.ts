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

@Controller()
export class AppController {
    constructor(
	private readonly appService: AppService,
	private readonly authService: AuthService,
    ) { }

    @UseGuards(LocalAuthGuard) /* Comprobación de credenciales */
    @Post('auth/login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}
