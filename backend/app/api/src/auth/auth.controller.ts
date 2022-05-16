import { Controller, Get, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from 'src/user/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

	constructor( private authService : AuthService){}

	@Get('42')
	@UseGuards( AuthGuard('42') )
	async fortyTwo() : Promise<any> {
		return await this.authService.fortyTwo();
	}

	@Get('42/redirect')
	@UseGuards( AuthGuard('42') )
	async fortyTwoRedirect( @Req() req: Request ) : Promise<UserDto>{
		const { user } = <any>req;
		return await this.authService.createUserFortyTwo( user.user );
	}
}
