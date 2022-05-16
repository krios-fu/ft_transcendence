import { Injectable, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Injectable()
export class AuthService {

	async fortyTwo() : Promise<any> {
		return HttpStatus.OK;
	}

	@UseGuards( AuthGuard('42') )
	async fortyTwoRedirect( @Req() req: Request ) : Promise<any>{
		const { user } = <any>req;

		return user;
	}

}
