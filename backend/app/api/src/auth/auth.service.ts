import { Injectable, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';



@Injectable()
export class AuthService {

		constructor( private userService : UserService ){}
	async fortyTwo() : Promise<any> {
		return HttpStatus.OK;
	}

	@UseGuards( AuthGuard('42') )
	async createUserFortyTwo( newUser : UserDto ) : Promise<UserDto>{
		return await this.userService.create( newUser );
	}
}
