import { Controller, Get, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

	@Get('42')
	@UseGuards( AuthGuard('42') )
	async fortyTwo() : Promise<any> {
		return HttpStatus.OK;
	}

	@Get('42/redirect')
	@UseGuards( AuthGuard('42') )
	async fortyTwoRedirect( @Req() req: Request ) : Promise<any>{
		const { user } = <any>req;

		return user;
	}
}
