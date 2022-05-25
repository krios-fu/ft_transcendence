import {
    Controller,
    Get,
    Request,
    Post,
    UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @UseGuards(LocalAuthGuard) /* Comprobación de credenciales */
    @Post('auth/login')
    async login(@Request() req) {
        return req.user;
    }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}
