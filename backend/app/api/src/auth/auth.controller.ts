import { Controller, Get, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

	constructor( private authService : AuthService, private userService : UserService ){}

	@Get('42')
	@UseGuards( AuthGuard('42') )
	async fortyTwo() : Promise<any> {
		return await this.authService.fortyTwo();
	}

	@Get('42/redirect')
	@UseGuards( AuthGuard('42') )
	async fortyTwoRedirect( @Req() req: Request ) : Promise<any>{
		const { user } = <any>req;

		console.log( user.user );
		this.userService.create( user.user );
		return user;
	}
}
